/* eslint-disable react/display-name */
import React, { createRef, FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Tab } from "semantic-ui-react";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { DecisionTO } from "../../../dataAccess/access/to/DecisionTO";
import { GoToTypes, Terminal } from "../../../dataAccess/access/types/GoToType";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { CalculatedStep, SequenceModelActions, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";

interface SequenceTableModelControllerProps {
  fullScreen?: boolean;
}

interface CarvTableRow {}

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = (props) => {
  const { fullScreen } = props;
  const { title, getTableBody, getDecisionTableBody, getStepTableBody } = useSequenceTableViewModel();

  enum table {
    step = "step",
    decision = "decision",
    sequence = "sequence",
  }

  const panes = [
    {
      menuItem: "Sequence",
      render: () => (
        <Tab.Pane>
          <div>
            <label>{title}</label>
          </div>
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
            <tbody>{getTableBody()}</tbody>
          </table>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Decision",
      render: () => (
        <Tab.Pane>
          <div>
            <label>DECISIONS</label>
          </div>
          <table>
            <thead>
              <tr>
                <th>INDEX</th>
                <th>NAME</th>
                <th>RESULT</th>
              </tr>
            </thead>
            <tbody>{getDecisionTableBody()}</tbody>
          </table>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Steps",
      render: () => (
        <Tab.Pane>
          <div>
            <label>STEPS</label>
          </div>
          <table>
            <thead>
              <tr>
                <th>INDEX</th>
                <th>NAME</th>
                <th>SENDER</th>
                <th>RECEIVER</th>
              </tr>
            </thead>
            <tbody>{getStepTableBody()}</tbody>
          </table>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div className={fullScreen ? "" : "sequenceTable"}>
      <Tab panes={panes} menu={{ inverted: true, attached: true, tabular: false }} />
    </div>
  );
};

const useSequenceTableViewModel = () => {
  const dispatch = useDispatch();
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
  const calcSteps: CalculatedStep[] = useSelector(sequenceModelSelectors.selectCalcSteps);
  const terminalStep: Terminal | null = useSelector(sequenceModelSelectors.selectTerminalStep);
  const loopStepStartIndex: number | null = useSelector(sequenceModelSelectors.selectLoopStepStartIndex);

  const createSequenceStepColumn = (step: CalculatedStep, index: number): JSX.Element => {
    let trClass: string = loopStepStartIndex && loopStepStartIndex <= index ? "carv2TrTerminalError" : "carv2Tr";

    const myRef = createRef<HTMLTableRowElement>();
    const scrollToRef = (ref: any) => window.scrollTo(0, ref.offsetTop);

    if (index === stepIndex) {
      trClass = "carv2TrMarked";
      scrollToRef(myRef);
    }
    const modelStep: SequenceStepCTO | undefined = sequence?.sequenceStepCTOs.find(
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
      <tr key={index} className={trClass} onClick={() => handleTableClickEvent(index)} ref={myRef}>
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
    if (index === stepIndex) {
      trClass = "carv2TrMarked";
    }
    return (
      <tr key={index} className={trClass} onClick={() => handleTableClickEvent(index)}>
        <td className="carv2Td">{index}</td>
        <td className="carv2Td">{name}</td>
        <td className="carv2Td">{source}</td>
        <td className="carv2Td">{target}</td>
      </tr>
    );
  };

  const createDecisionColumn = (decision: DecisionTO, index: number): JSX.Element => {
    const name = decision.name;
    let trClass = "carv2Tr";
    if (index === stepIndex) {
      trClass = "carv2TrMarked";
    }
    return (
      <tr key={index} className={trClass} onClick={() => handleTableClickEvent(index)}>
        <td className="carv2Td">{index}</td>
        <td className="carv2Td">{name}</td>
      </tr>
    );
  };

  const createTerminalColumn = (terminal: Terminal): JSX.Element => {
    const className = terminal.type === GoToTypes.ERROR ? "carv2TrTerminalError" : "carv2TrTerminalSuccess";
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

  const getTableBody = () => {
    let list: JSX.Element[] = [];
    list = calcSteps.map((step, index) => createSequenceStepColumn(step, index));
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

  const getStepTableBody = () => {
    let list: JSX.Element[] = [];
    let key: number = 0;
    if (sequence !== null) {
      list = sequence?.sequenceStepCTOs.map((step, index) => createModelStepColumn(step, index));
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
    if (sequence !== null) {
      list = sequence.decisions.map((cond, index) => createDecisionColumn(cond, index));
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

  const handleTableClickEvent = (index: number) => {
    dispatch(SequenceModelActions.setCurrentStepIndex(index));
  };

  return {
    title: sequence ? sequence.sequenceTO.name : "Select data setup and sequence to calculate ...",
    getTableBody,
    getDecisionTableBody,
    getStepTableBody,
  };
};
