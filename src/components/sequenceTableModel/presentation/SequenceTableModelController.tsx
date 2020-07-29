import React, { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { ConditionTO } from "../../../dataAccess/access/to/ConditionTO";
import { GoToTypes, Terminal } from "../../../dataAccess/access/types/GoToType";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { CalculatedStep, SequenceModelActions, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { Carv2ButtonLabel } from "../../common/fragments/buttons/Carv2Button";

interface SequenceTableModelControllerProps {
  fullScreen?: boolean;
}

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = (props) => {
  const { fullScreen } = props;
  const { title, getTableBody, getConditionTableBody, getStepTableBody } = useSequenceTableViewModel();

  enum table {
    step = "step",
    condition = "condition",
    sequence = "sequence",
  }

  const [mode, setMode] = useState<table>(table.sequence);

  return (
    <div className={fullScreen ? "" : "sequenceTable"}>
      <div className="tabs">
        <Carv2ButtonLabel
          label="Sequence"
          onClick={() => {
            setMode(table.sequence);
          }}
        />
        <Carv2ButtonLabel
          label="Conditions"
          onClick={() => {
            setMode(table.condition);
          }}
        />
        <Carv2ButtonLabel
          label="Steps"
          onClick={() => {
            setMode(table.step);
          }}
        />
      </div>
      {mode === table.sequence && (
        <div>
          <div className="carv2TableHeader">
            <label>{title}</label>
          </div>
          <table className="carv2Table">
            <thead>
              <tr>
                <th className="carv2Th" style={{ width: "15px" }}>
                  INDEX
                </th>
                <th className="carv2Th">NAME</th>
                <th className="carv2Th">SENDER</th>
                <th className="carv2Th">RECEIVER</th>
                <th className="carv2Th">ACTION-ERROR</th>
              </tr>
            </thead>
            <tbody className="carv2TBody">{getTableBody()}</tbody>
          </table>
        </div>
      )}
      {mode === table.step && (
        <div>
          <div className="carv2TableHeader">
            <label>STEPS</label>
          </div>
          <table className="carv2Table">
            <thead>
              <tr>
                <th className="carv2Th" style={{ width: "15px" }}>
                  INDEX
                </th>
                <th className="carv2Th">NAME</th>
                <th className="carv2Th">SENDER</th>
                <th className="carv2Th">RECEIVER</th>
              </tr>
            </thead>
            <tbody className="carv2TBody">{getStepTableBody()}</tbody>
          </table>
        </div>
      )}
      {mode === table.condition && (
        <div>
          <div className="carv2TableHeader">
            <label>CONDITIONS</label>
          </div>
          <table className="carv2Table">
            <thead>
              <tr>
                <th className="carv2Th" style={{ width: "15px" }}>
                  INDEX
                </th>
                <th className="carv2Th">NAME</th>
                <th className="carv2Th">RESULT</th>
              </tr>
            </thead>
            <tbody className="carv2TBody">{getConditionTableBody()}</tbody>
          </table>
        </div>
      )}
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
    if (index === stepIndex) {
      trClass = "carv2TrMarked";
    }
    const modelStep: SequenceStepCTO | undefined = sequence?.sequenceStepCTOs.find(
      (item) => item.squenceStepTO.id === step.stepFk
    );

    // const modelCondition: ConditionTO | undefined = sequence?.conditions.find((con) => con.id === step.stepFk);

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
      <tr key={index} className={trClass} onClick={() => handleTableClickEvent(index)}>
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

  const createConditionColumn = (condition: ConditionTO, index: number): JSX.Element => {
    const name = condition.name;
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

  const getConditionTableBody = () => {
    let list: JSX.Element[] = [];
    // list = calcSteps.map((step, index) => createStepColumn(step, index));
    if (sequence !== null) {
      list = sequence.conditions.map((cond, index) => createConditionColumn(cond, index));
    }
    let key: number = list.length;
    while (list.length < 10) {
      list.push(createEmptyConditionRow(key.toString(), "carv2Tr"));
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

  const createEmptyConditionRow = (key: string, className?: string): JSX.Element => {
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
    title: sequence ? sequence.sequenceTO.name : "Select Sequence ...",
    getTableBody,
    getConditionTableBody,
    getStepTableBody,
  };
};
