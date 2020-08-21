/* eslint-disable react/display-name */
import React, { createRef, FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { ChainDecisionTO } from "../../../dataAccess/access/to/ChainDecisionTO";
import { ChainlinkTO } from "../../../dataAccess/access/to/ChainlinkTO";
import { ChainTO } from "../../../dataAccess/access/to/ChainTO";
import { DataSetupTO } from "../../../dataAccess/access/to/DataSetupTO";
import { DecisionTO } from "../../../dataAccess/access/to/DecisionTO";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";
import { Terminal } from "../../../dataAccess/access/types/GoToType";
import { CalcChain, CalcChainLink } from "../../../SequenceChainService";
import { CalculatedStep } from "../../../SequenceService";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";

interface SequenceTableModelControllerProps {
  fullScreen?: boolean;
}

interface CarvTableRow {}

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = (props) => {
  const { fullScreen } = props;
  const {
    getCalcSequenceTableBody,
    getDecisionTableBody,
    getStepTableBody,
    getChainTableBody,
    getSequenceModelsTableBody,
    getChainDecisionTableBody,
    getChainLinkTableBody,
    showChainModelTab,
    showSequenceModelTabs,
    showCalcChainTab,
    showCalcSequenceTab,
  } = useSequenceTableViewModel();

  enum TableBody {
    step = "step",
    decision = "decision",
    sequence = "sequence",
    chain = "chain",
    chainlinks = "chainlinks",
    chaindecisions = "chaindecisions",
    sequenceModels = "sequenceModels",
  }

  const [body, setBody] = useState<TableBody>(TableBody.sequence);

  return (
    <div className={fullScreen ? "" : "sequenceTable"}>
      <div className="tableBorder">
        <div className="tabs">
          {showCalcChainTab && (
            <div className={body === TableBody.chain ? "tab active" : "tab"} onClick={() => setBody(TableBody.chain)}>
              Chain
            </div>
          )}
          {showChainModelTab && (
            <div
              className={body === TableBody.chaindecisions ? "tab active" : "tab"}
              onClick={() => setBody(TableBody.chaindecisions)}
            >
              Chain Decision
            </div>
          )}
          {showChainModelTab && (
            <div
              className={body === TableBody.chainlinks ? "tab active" : "tab"}
              onClick={() => setBody(TableBody.chainlinks)}
            >
              Chain Link
            </div>
          )}
          {showCalcSequenceTab && (
            <div
              className={body === TableBody.sequence ? "tab active" : "tab"}
              onClick={() => setBody(TableBody.sequence)}
            >
              Sequence
            </div>
          )}
          <div
            className={body === TableBody.sequenceModels ? "tab active" : "tab"}
            onClick={() => setBody(TableBody.sequenceModels)}
          >
            SequenceModels
          </div>
          {showSequenceModelTabs && (
            <div
              className={body === TableBody.decision ? "tab active" : "tab"}
              onClick={() => setBody(TableBody.decision)}
            >
              Decisions
            </div>
          )}
          {showSequenceModelTabs && (
            <div className={body === TableBody.step ? "tab active" : "tab"} onClick={() => setBody(TableBody.step)}>
              Steps
            </div>
          )}
        </div>

        {body === TableBody.chain && (
          <table>
            <thead>
              <tr>
                <th>INDEX</th>
                <th>SEQUENCE</th>
                <th>DATASETUP</th>
              </tr>
            </thead>
            <tbody>{getChainTableBody()}</tbody>
          </table>
        )}
        {body === TableBody.chaindecisions && (
          <table>
            <thead>
              <tr>
                <th>NAME</th>
              </tr>
            </thead>
            <tbody>{getChainDecisionTableBody()}</tbody>
          </table>
        )}
        {body === TableBody.chainlinks && (
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>SEQUENCE</th>
                <th>DATASETUP</th>
              </tr>
            </thead>
            <tbody>{getChainLinkTableBody()}</tbody>
          </table>
        )}

        {body === TableBody.step && (
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>SENDER</th>
                <th>RECEIVER</th>
              </tr>
            </thead>
            <tbody>{getStepTableBody()}</tbody>
          </table>
        )}

        {body === TableBody.decision && (
          <table>
            <thead>
              <tr>
                <th>NAME</th>
              </tr>
            </thead>
            <tbody>{getDecisionTableBody()}</tbody>
          </table>
        )}

        {body === TableBody.sequence && (
          <table>
            <thead>
              <tr>
                <th>INDEX</th>
                <th>NAME</th>
                <th>SENDER</th>
                <th>RECEIVER</th>
                <th>ACTION-ERROR</th>
              </tr>
            </thead>
            <tbody>{getCalcSequenceTableBody()}</tbody>
          </table>
        )}

        {body === TableBody.sequenceModels && (
          <table>
            <thead>
              <tr>
                <th>NAME</th>
              </tr>
            </thead>
            <tbody>{getSequenceModelsTableBody()}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const useSequenceTableViewModel = () => {
  const dispatch = useDispatch();
  const selectSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
  const calcSteps: CalculatedStep[] = useSelector(sequenceModelSelectors.selectCalcSteps);
  const terminalStep: Terminal | null = useSelector(sequenceModelSelectors.selectTerminalStep);
  const loopStepStartIndex: number | null = useSelector(sequenceModelSelectors.selectLoopStepStartIndex);
  const calcChain: CalcChain | null = useSelector(sequenceModelSelectors.selectCalcChain);
  const sequences: SequenceTO[] = useSelector(masterDataSelectors.sequences);
  const dataSetups: DataSetupTO[] = useSelector(masterDataSelectors.dataSetup);
  const chainlinks: ChainlinkTO[] = useSelector(masterDataSelectors.chainLinks);
  const chainDecisions: ChainDecisionTO[] = useSelector(masterDataSelectors.chainDecisions);
  const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);

  const createCalcSequenceStepColumn = (step: CalculatedStep, index: number): JSX.Element => {
    let trClass: string = loopStepStartIndex && loopStepStartIndex <= index ? "carv2TrTerminalError" : "carv2Tr";

    const myRef = createRef<HTMLTableRowElement>();
    const scrollToRef = (ref: any) => window.scrollTo(0, ref.offsetTop);

    if (index === stepIndex) {
      trClass = "carv2TrMarked";
      scrollToRef(myRef);
    }
    const modelStep: SequenceStepCTO | undefined = selectSequence?.sequenceStepCTOs.find(
      (item) => item.squenceStepTO.id === step.stepFk
    );

    let name = index === 0 && !modelStep ? "Initial" : modelStep?.squenceStepTO.name || "Step not found";

    const source =
      index === 0 && !modelStep
        ? ""
        : modelStep
        ? getComponentNameById(modelStep.squenceStepTO.sourceComponentFk)
        : "Source not found";
    const target =
      index === 0 && !modelStep
        ? ""
        : modelStep
        ? getComponentNameById(modelStep.squenceStepTO.targetComponentFk)
        : "Target not found";
    const hasError = step.errors.length > 0 ? true : false;

    return (
      <tr key={index} className={trClass} onClick={() => handleSequenceTableClickEvent(index)} ref={myRef}>
        <td className="carv2Td">{index}</td>
        <td className="carv2Td">{name}</td>
        <td className="carv2Td">{source}</td>
        <td className="carv2Td">{target}</td>
        <td className="carv2Td">{hasError && <Icon name="warning sign" color="red" />}</td>
      </tr>
    );
  };

  const createModelStepColumn = (step: SequenceStepCTO, index: number): JSX.Element => {
    const name = step.squenceStepTO.name;
    const source = getComponentNameById(step.squenceStepTO.sourceComponentFk);
    const target = getComponentNameById(step.squenceStepTO.targetComponentFk);

    let trClass = "carv2Tr";

    return (
      <tr key={index} className={trClass}>
        <td className="carv2Td">{index}</td>
        <td className="carv2Td">{name}</td>
        <td className="carv2Td">{source}</td>
        <td className="carv2Td">{target}</td>
      </tr>
    );
  };
  const createSequenceModelColumn = (sequence: SequenceTO, index: number): JSX.Element => {
    const name = sequence.name;
    let trClass = "carv2Tr";
    return (
      <tr key={index} className={trClass}>
        <td className="carv2Td">{name}</td>
      </tr>
    );
  };

  const createDecisionColumn = (decision: DecisionTO, index: number): JSX.Element => {
    const name = decision.name;
    let trClass = "carv2Tr";
    return (
      <tr key={index} className={trClass}>
        <td className="carv2Td">{index}</td>
        <td className="carv2Td">{name}</td>
      </tr>
    );
  };

  const createCalcLinkColumn = (link: CalcChainLink, index: number): JSX.Element => {
    const sequenceName: string = link.sequence.sequenceModel?.sequenceTO.name || "Sequence name not found!";
    const dataSetupName: string = link.dataSetup.dataSetup?.name || "Data setup name not found!";
    let trClass = "carv2Tr";
    return (
      <tr key={index} className={trClass} onClick={() => handleChainTableClickEvent(index)}>
        <td className="carv2Td">{index}</td>
        <td className="carv2Td">{sequenceName}</td>
        <td className="carv2Td">{dataSetupName}</td>
      </tr>
    );
  };

  const createLinkColumn = (link: ChainlinkTO, index: number): JSX.Element => {
    const name: string = link.name;
    const sequenceName: string =
      sequences.find((seq) => seq.id === link.sequenceFk)?.name || "Sequence name not found!";
    const dataSetupName: string =
      dataSetups.find((data) => data.id === link.dataSetupFk)?.name || "Data setup name not found!";
    let trClass = "carv2Tr";
    return (
      <tr key={index} className={trClass}>
        <td className="carv2Td">{name}</td>
        <td className="carv2Td">{sequenceName}</td>
        <td className="carv2Td">{dataSetupName}</td>
      </tr>
    );
  };

  const createChainDecisionColumn = (decision: ChainDecisionTO, index: number): JSX.Element => {
    const name: string = decision.name;
    let trClass = "carv2Tr";
    return (
      <tr key={index} className={trClass}>
        <td className="carv2Td">{name}</td>
      </tr>
    );
  };

  const createTerminalColumn = (terminal: Terminal): JSX.Element => {
    const className = "carv2TrTerminal" + terminal.type;
    return (
      <tr key={"Terminal"} className={className}>
        <td> </td>
        <td>{terminal.type}</td>
        <td> </td>
        <td> </td>
        <td> </td>
      </tr>
    );
  };

  const getCalcSequenceTableBody = () => {
    let list: JSX.Element[] = [];
    list = calcSteps.map((step, index) => createCalcSequenceStepColumn(step, index));
    if (terminalStep) {
      list.push(createTerminalColumn(terminalStep));
    }
    let key: number = list.length;
    while (list.length < 10) {
      list.push(createEmptyRow(key.toString(), "carv2Tr"));
      key++;
    }
    return list;
  };

  const getSequenceModelsTableBody = () => {
    let list: JSX.Element[] = [];
    if (sequences) {
      list = sequences.map((sequence, index) => createSequenceModelColumn(sequence, index));
    }
    let key: number = list.length;
    while (list.length < 10) {
      list.push(createEmptyRow(key.toString(), "carv2Tr"));
      key++;
    }
    return list;
  };

  const getStepTableBody = () => {
    let list: JSX.Element[] = [];
    let key: number = 0;
    if (selectSequence !== null) {
      list = selectSequence?.sequenceStepCTOs.map((step, index) => createModelStepColumn(step, index));
      key = list.length;
    }
    while (list.length < 10) {
      list.push(createEmptyStepRow(key.toString(), "carv2Tr"));
      key++;
    }
    return list;
  };

  const getDecisionTableBody = () => {
    let list: JSX.Element[] = [];
    if (selectSequence !== null) {
      list = selectSequence.decisions.map((cond, index) => createDecisionColumn(cond, index));
    }
    let key: number = list.length;
    while (list.length < 10) {
      list.push(createEmptyDecisionRow(key.toString(), "carv2Tr"));
      key++;
    }
    return list;
  };

  const getChainTableBody = () => {
    let list: JSX.Element[] = [];
    if (calcChain !== null) {
      list = calcChain.calcLinks.map((link, index) => createCalcLinkColumn(link, index));
    }
    let key: number = list.length;
    while (list.length < 10) {
      list.push(createEmptyDecisionRow(key.toString(), "carv2Tr"));
      key++;
    }
    return list;
  };
  const getChainLinkTableBody = () => {
    let list: JSX.Element[] = [];
    if (calcChain !== null) {
      list = chainlinks.map((link, index) => createLinkColumn(link, index));
    }
    let key: number = list.length;
    while (list.length < 10) {
      list.push(createEmptyDecisionRow(key.toString(), "carv2Tr"));
      key++;
    }
    return list;
  };
  const getChainDecisionTableBody = () => {
    let list: JSX.Element[] = [];
    if (calcChain !== null) {
      list = chainDecisions.map((decision, index) => createChainDecisionColumn(decision, index));
    }
    let key: number = list.length;
    while (list.length < 10) {
      list.push(createEmptyDecisionRow(key.toString(), "carv2Tr"));
      key++;
    }
    return list;
  };

  const createEmptyRow = (key: string, className?: string): JSX.Element => {
    return (
      <tr key={key} className={className}>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
      </tr>
    );
  };

  const createEmptyStepRow = (key: string, className?: string): JSX.Element => {
    return (
      <tr key={key} className={className}>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
      </tr>
    );
  };

  const createEmptyDecisionRow = (key: string, className?: string): JSX.Element => {
    return (
      <tr key={key} className={className}>
        <td> </td>
        <td> </td>
        <td> </td>
      </tr>
    );
  };

  const getComponentNameById = (id: number): string => {
    return components.find((comp) => comp.component.id === id)?.component.name || "Could not find Component!";
  };

  const handleSequenceTableClickEvent = (index: number) => {
    dispatch(SequenceModelActions.setCurrentStepIndex(index));
  };

  const handleChainTableClickEvent = (index: number) => {
    dispatch(SequenceModelActions.setCurrentLinkIndex(index));
  };

  return {
    title: selectSequence ? selectSequence.sequenceTO.name : "Select data setup and sequence to calculate ...",
    getCalcSequenceTableBody,
    getDecisionTableBody,
    getStepTableBody,
    getChainTableBody,
    getSequenceModelsTableBody,
    getChainDecisionTableBody,
    getChainLinkTableBody,
    showChainModelTab: !isNullOrUndefined(selectedChain),
    showSequenceModelTabs: !isNullOrUndefined(selectSequence),
    showCalcChainTab: !isNullOrUndefined(calcChain),
    showCalcSequenceTab: calcSteps.length > 0,
  };
};
