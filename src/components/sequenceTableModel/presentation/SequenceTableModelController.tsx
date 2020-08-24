/* eslint-disable react/display-name */
import React, { createRef, FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { Carv2TableButton } from "../../../components/common/fragments/buttons/Carv2TableButton";
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
import { EditActions, editSelectors, Mode } from "../../../slices/EditSlice";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { TabFragment } from "../fragments/TabFragment";
import { TabGroupFragment } from "../fragments/TabGroupFragment";

interface SequenceTableModelControllerProps {
  fullScreen?: boolean;
}

enum ActiveTab {
  step = "step",
  decision = "decision",
  sequence = "sequence",
  chain = "chain",
  chainlinks = "chainlinks",
  chaindecisions = "chaindecisions",
  sequenceModels = "sequenceModels",
  chainModel = "chainModels",
  dataSetup = "dataSetup",
}

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
    getChainModelsTableBody,
    getDataSetupTableBody,
    showChainModelTab,
    showSequenceModelTabs,
    showCalcChainTab,
    showCalcSequenceTab,
    activeTab,
    setActiveTab,
  } = useSequenceTableViewModel();

  const createTable = (headerValues: string[], body: JSX.Element[]) => {
    return (
      <table>
        <thead>
          <tr>
            {headerValues.map((value, index) => {
              return <th key={index}>{value}</th>;
            })}
          </tr>
        </thead>
        <tbody style={{ height: tableHeight }}>{body}</tbody>
      </table>
    );
  };

  const chainTableHead = ["INDEX", "SEQUENCE", "DATASETUP"];
  const chaindecisionsTableHead = ["NAME", "ACTIONS"];
  const chainlinkTableHead = ["NAME", "SEQUENCE", "DATASETUP", "ACTIONS"];
  const sequenceStepTableHead = ["NAME", "SENDER", "RECEIVER", "ACTIONS"];
  const seqeunceDcisionsTableHead = ["NAME", "ACTIONS"];
  const calcSequenceTableHead = ["INDEX", "NAME", "SENDER", "RECEIVER", "ACTION-ERROR"];
  const seqeunceModelTableHead = ["NAME", "ACTIONS"];
  const chainModelTableHead = ["NAME", "ACTIONS"];
  const dataSetupTableHead = ["NAME", "ACTIONS"];

  const getTabsKey = () => {
    let key = showCalcChainTab ? "chain" : "";
    key += showSequenceModelTabs ? "seqModel" : "";
    key += showChainModelTab ? "chainModel" : "";
    key += showCalcSequenceTab ? "seq" : "";
    return key;
  };

  const parentRef = useRef<HTMLDivElement>(null);

  const [tableHeight, setTabelHeihgt] = useState<number>(0);

  useEffect(() => {
    const resizeListener = () => {
      if (parentRef && parentRef.current) {
        setTabelHeihgt(parentRef.current.offsetHeight - 120);
      }
    };

    resizeListener();
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [parentRef]);

  return (
    <div className={fullScreen ? "" : "sequenceTable"} ref={parentRef}>
      <div className="tableBorder">
        <div className="tabs" key={getTabsKey()}>
          {(showCalcChainTab || showCalcSequenceTab) && (
            <TabGroupFragment label="Calculated">
              {showCalcChainTab && (
                <TabFragment
                  label="Chain"
                  isActive={activeTab === ActiveTab.chain}
                  onClick={() => setActiveTab(ActiveTab.chain)}
                />
              )}
              {showCalcSequenceTab && (
                <TabFragment
                  label="Sequence"
                  isActive={activeTab === ActiveTab.sequence}
                  onClick={() => setActiveTab(ActiveTab.sequence)}
                />
              )}
            </TabGroupFragment>
          )}
          {showChainModelTab && (
            <TabGroupFragment label="Chain Model">
              <TabFragment
                label="Decision"
                isActive={activeTab === ActiveTab.chaindecisions}
                onClick={() => setActiveTab(ActiveTab.chaindecisions)}
              />
              <TabFragment
                label="Links"
                isActive={activeTab === ActiveTab.chainlinks}
                onClick={() => setActiveTab(ActiveTab.chainlinks)}
              />
            </TabGroupFragment>
          )}
          {showSequenceModelTabs && (
            <TabGroupFragment label="Sequence Model">
              <TabFragment
                label="Decision"
                isActive={activeTab === ActiveTab.decision}
                onClick={() => setActiveTab(ActiveTab.decision)}
              />
              <TabFragment label="Steps" isActive={activeTab === ActiveTab.step} onClick={() => setActiveTab(ActiveTab.step)} />
            </TabGroupFragment>
          )}
          <TabGroupFragment label="Models">
            <TabFragment
              label="Chain"
              isActive={activeTab === ActiveTab.chainModel}
              onClick={() => setActiveTab(ActiveTab.chainModel)}
            />
            <TabFragment
              label="Sequence"
              isActive={activeTab === ActiveTab.sequenceModels}
              onClick={() => setActiveTab(ActiveTab.sequenceModels)}
            />
            <TabFragment
              label="Data Setup"
              isActive={activeTab === ActiveTab.dataSetup}
              onClick={() => setActiveTab(ActiveTab.dataSetup)}
            />
          </TabGroupFragment>
        </div>

        {activeTab === ActiveTab.chain && createTable(chainTableHead, getChainTableBody())}
        {activeTab === ActiveTab.chaindecisions && createTable(chaindecisionsTableHead, getChainDecisionTableBody())}
        {activeTab === ActiveTab.chainlinks && createTable(chainlinkTableHead, getChainLinkTableBody())}
        {activeTab === ActiveTab.step && createTable(sequenceStepTableHead, getStepTableBody())}
        {activeTab === ActiveTab.decision && createTable(seqeunceDcisionsTableHead, getDecisionTableBody())}

        {activeTab === ActiveTab.sequence && createTable(calcSequenceTableHead, getCalcSequenceTableBody())}

        {activeTab === ActiveTab.sequenceModels && createTable(seqeunceModelTableHead, getSequenceModelsTableBody())}
        {activeTab === ActiveTab.chainModel && createTable(chainModelTableHead, getChainModelsTableBody())}
        {activeTab === ActiveTab.dataSetup && createTable(dataSetupTableHead, getDataSetupTableBody())}
      </div>
    </div>
  );
};

const useSequenceTableViewModel = () => {
  const dispatch = useDispatch();
  const selectSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
  const chainIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentLinkIndex);
  const calcSteps: CalculatedStep[] = useSelector(sequenceModelSelectors.selectCalcSteps);
  const terminalStep: Terminal | null = useSelector(sequenceModelSelectors.selectTerminalStep);
  const loopStepStartIndex: number | null = useSelector(sequenceModelSelectors.selectLoopStepStartIndex);
  const calcChain: CalcChain | null = useSelector(sequenceModelSelectors.selectCalcChain);
  const sequences: SequenceTO[] = useSelector(masterDataSelectors.sequences);
  const dataSetups: DataSetupTO[] = useSelector(masterDataSelectors.dataSetup);
  const chainlinks: ChainlinkTO[] = useSelector(masterDataSelectors.chainLinks);
  const chainDecisions: ChainDecisionTO[] = useSelector(masterDataSelectors.chainDecisions);
  const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
  const chainModles: ChainTO[] = useSelector(masterDataSelectors.chains);
  const mode: Mode = useSelector(editSelectors.mode);

  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.sequence);

  useEffect(() => {
    let newActiveTab: ActiveTab | undefined = undefined;
    switch (mode) {
      case Mode.VIEW:
        if (selectedChain) {
          newActiveTab = ActiveTab.chain;
        } else {
          newActiveTab = ActiveTab.sequence;
        }
        break;
      case Mode.EDIT_CHAIN:
        newActiveTab = ActiveTab.chainModel;
        break;
      case Mode.EDIT_CHAIN_DECISION:
      case Mode.EDIT_CHAIN_DECISION_CONDITION:
        newActiveTab = ActiveTab.chaindecisions;
        break;
      case Mode.EDIT_SEQUENCE:
        newActiveTab = ActiveTab.sequenceModels;
        break;
      case Mode.EDIT_SEQUENCE_DECISION:
      case Mode.EDIT_SEQUENCE_DECISION_CONDITION:
        newActiveTab = ActiveTab.decision;
        break;
      case Mode.EDIT_SEQUENCE_STEP:
      case Mode.EDIT_SEQUENCE_STEP_ACTION:
        newActiveTab = ActiveTab.step;
        break;
    }
    if (newActiveTab) {
      setActiveTab(newActiveTab);
    }

  }, [mode, selectedChain])

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
      <tr key={index} className={'clickable ' + trClass} onClick={() => handleSequenceTableClickEvent(index)} ref={myRef}>
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
        <td className="carv2Td">{name}</td>
        <td className="carv2Td">{source}</td>
        <td className="carv2Td">{target}</td>
        <td className="carv2Td"><Carv2TableButton icon="wrench" onClick={() => dispatch(EditActions.setMode.editStep(step))} /></td>
      </tr>
    );
  };
  const createSequenceModelColumn = (sequence: SequenceTO, index: number): JSX.Element => {
    const name = sequence.name;
    let trClass = "carv2Tr";
    return (
      <tr key={index} className={trClass}>
        <td className="carv2Td">{name}</td>
        <td className="carv2Td">
          <Carv2TableButton icon="wrench" onClick={() => dispatch(EditActions.setMode.editSequence(sequence.id))} />
          <Carv2TableButton icon="hand pointer" onClick={() => {
            dispatch(SequenceModelActions.setCurrentSequence(sequence.id))
            dispatch(EditActions.setMode.view())
          }} />
        </td>
      </tr>
    );
  };
  const createChainModelColumn = (chain: ChainTO, index: number): JSX.Element => {
    const name = chain.name;
    let trClass = "carv2Tr";
    return (
      <tr key={index} className={trClass}>
        <td className="carv2Td">{name}</td>
        <td className="carv2Td">
          <Carv2TableButton icon="wrench" onClick={() => dispatch(EditActions.setMode.editChain(chain))} />
          <Carv2TableButton icon="hand pointer" onClick={() => {
            dispatch(SequenceModelActions.setCurrentChain(chain))
            dispatch(EditActions.setMode.view())
          }} />
        </td>
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
        <td className="carv2Td"><Carv2TableButton icon="wrench" onClick={() => dispatch(EditActions.setMode.editDecision(decision))} /></td>
      </tr>
    );
  };

  const createCalcLinkColumn = (link: CalcChainLink, index: number): JSX.Element => {
    const sequenceName: string = link.sequence.sequenceModel?.sequenceTO.name || "Sequence name not found!";
    const dataSetupName: string = link.dataSetup.dataSetup?.name || "Data setup name not found!";
    let trClass = "carv2Tr";
    if (index === chainIndex) {
      trClass = "carv2TrMarked";
    }
    return (
      <tr key={index} className={'clickable ' + trClass} onClick={() => handleChainTableClickEvent(index)}>
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
        <td className="carv2Td"><Carv2TableButton icon="wrench" onClick={() => dispatch(EditActions.setMode.editChainLink(link))} /></td>
      </tr>
    );
  };

  const createChainDecisionColumn = (decision: ChainDecisionTO, index: number): JSX.Element => {
    const name: string = decision.name;
    let trClass = "carv2Tr";
    return (
      <tr key={index} className={trClass}>
        <td className="carv2Td">{name}</td>
        <td className="carv2Td">
          <Carv2TableButton icon="wrench" onClick={() => dispatch(EditActions.setMode.editChainDecision(decision))} />
        </td>
      </tr>
    );
  };

  const createDataSetupColumn = (dataSetup: DataSetupTO, index: number): JSX.Element => {
    const name: string = dataSetup.name;
    let trClass = "carv2Tr";
    return (
      <tr key={index} className={trClass}>
        <td className="carv2Td">{name}</td>
        <td className="carv2Td">
          <Carv2TableButton icon="wrench" onClick={() => dispatch(EditActions.setMode.editDataSetup(dataSetup.id))} />
          <Carv2TableButton icon="hand pointer" onClick={() => {
            dispatch(SequenceModelActions.setCurrentDataSetup(dataSetup.id))
            dispatch(EditActions.setMode.view())
          }} />
        </td>
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
    const numberOfColumns = 5;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };

  const getSequenceModelsTableBody = () => {
    let list: JSX.Element[] = [];
    if (sequences) {
      list = sequences.map((sequence, index) => createSequenceModelColumn(sequence, index));
    }
    const numberOfColumns = 1;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };

  const getChainModelsTableBody = () => {
    let list: JSX.Element[] = [];
    if (sequences) {
      list = chainModles.map((chain, index) => createChainModelColumn(chain, index));
    }
    const numberOfColumns = 1;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };

  const getStepTableBody = () => {
    let list: JSX.Element[] = [];
    if (selectSequence !== null) {
      list = selectSequence?.sequenceStepCTOs.map((step, index) => createModelStepColumn(step, index));
    }
    const numberOfColumns = 4;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };

  const getDecisionTableBody = () => {
    let list: JSX.Element[] = [];
    if (selectSequence !== null) {
      list = selectSequence.decisions.map((cond, index) => createDecisionColumn(cond, index));
    }
    const numberOfColumns = 2;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };

  const getChainTableBody = () => {
    let list: JSX.Element[] = [];
    if (calcChain !== null) {
      list = calcChain.calcLinks.map((link, index) => createCalcLinkColumn(link, index));
    }
    const numberOfColumns = 3;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };
  const getChainLinkTableBody = () => {
    let list: JSX.Element[] = [];
    if (calcChain !== null) {
      list = chainlinks.map((link, index) => createLinkColumn(link, index));
    }
    const numberOfColumns = 3;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };
  const getChainDecisionTableBody = () => {
    let list: JSX.Element[] = [];
    if (calcChain !== null) {
      list = chainDecisions.map((decision, index) => createChainDecisionColumn(decision, index));
    }
    const numberOfColumns = 1;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };
  const getDataSetupTableBody = () => {
    let list: JSX.Element[] = [];
    list = dataSetups.map((dataSetup, index) => createDataSetupColumn(dataSetup, index));
    const numberOfColumns = 1;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  }

  const createEmptyRow = (key: string, numberOfElements: number, className?: string): JSX.Element => {
    return (
      <tr key={key} className={className}>
        {new Array(numberOfElements).map((value, index) => {
          return <td key={index} />;
        })}
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
    getChainModelsTableBody,
    getDataSetupTableBody,
    showChainModelTab: !isNullOrUndefined(selectedChain),
    showSequenceModelTabs: !isNullOrUndefined(selectSequence),
    showCalcChainTab: !isNullOrUndefined(calcChain),
    showCalcSequenceTab: calcSteps.length > 0,
    activeTab,
    setActiveTab
    ,
  };
};
function fillWithEmptyRows(
  list: JSX.Element[],
  createEmptyRow: (key: string, numberOfElements: number, className?: string | undefined) => JSX.Element,
  numberOfColumns: number
) {
  let key: number = list.length;
  while (list.length < 10) {
    list.push(createEmptyRow(key.toString(), numberOfColumns, "carv2Tr"));
    key++;
  }
}
