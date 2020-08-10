/* eslint-disable no-case-declarations */
import React, { FunctionComponent } from "react";
import { ArcherContainer, ArcherElement, Relation } from "react-archer";
import { useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../dataAccess/access/cto/SequenceStepCTO";
import { ConditionTO } from "../../dataAccess/access/to/ConditionTO";
import { GoTo, GoToTypes, Terminal } from "../../dataAccess/access/types/GoToType";
import { handleError } from "../../slices/GlobalSlice";
import { CalculatedStep, sequenceModelSelectors } from "../../slices/SequenceModelSlice";
import { Carv2Util } from "../../utils/Carv2Util";

interface SequenceModelControllerProps {
  fullScreen?: boolean;
}

export const SequenceModelController: FunctionComponent<SequenceModelControllerProps> = (props) => {
  const { fullScreen } = props;
  const { nodeModelTree } = useFlowChartViewModel();

  const buildChart = (node: NodeModel): JSX.Element => {
    const rel: Relation[] = [];

    if (node.parentId) {
      rel.push({
        targetId: node.parentId,
        targetAnchor: "bottom",
        sourceAnchor: "top",
        style: {
          strokeColor:
            calcSteps.find((step) => step === node.parentId) && calcSteps.find((step) => step === node.id)
              ? isSuccess
                ? "green"
                : "red"
              : "black",
          strokeWidth:
            calcSteps.find((step) => step === node.parentId) && calcSteps.find((step) => step === node.id) ? 3 : 1,
        },
      });
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: node.id === "root" ? "" : "50px 0",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
        key={node.id}
      >
        <ArcherElement id={node.id} relations={rel}>
          <div
            className={node.id === "root" ? "ROOT" : node.leafType}
            style={{
              border: currentStep?.stepId === node.id ? "3px solid var(--carv2-color-secondary)" : "",
            }}
          >
            {node.id === "root" || node.leafType === GoToTypes.COND ? "" : node.label}
          </div>
        </ArcherElement>
        {node.leafType === GoToTypes.COND && <div className="condLabel">{node.label}</div>}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "start",
            width: "100%",
          }}
        >
          {node.childs.map(buildChart)}
        </div>
      </div>
    );
  };

  const buildFlowChart = (): JSX.Element => {
    return (
      <ArcherContainer noCurves={true} arrowLength={0}>
        {buildChart(nodeModelTree)}
      </ArcherContainer>
    );
  };

  return <div className={fullScreen ? "fullscreen" : "sequencModel"}>{buildFlowChart()}</div>;
};

interface NodeModel {
  parentId?: string;
  id: string;
  label: string;
  leafType: GoToTypes;
  childs: NodeModel[];
}

interface Node {
  value: SequenceStepCTO | ConditionTO | Terminal;
  isLoop: boolean;
  type: GoToTypes;
}

const useFlowChartViewModel = () => {
  // const dispatch = useDispatch();
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  // const sequenceToEdit: SequenceTO | null = useSelector(editSelectors.sequenceToEdit);
  const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
  const calcSteps: CalculatedStep[] = useSelector(sequenceModelSelectors.selectCalcSteps);
  const terminalStep: Terminal | null = useSelector(sequenceModelSelectors.selectTerminalStep);
  const stepIds: string[] = useSelector(sequenceModelSelectors.selectCalcStepIds);

  const getRoot = (sequence: SequenceCTO | null): Node => {
    let root: Node = {
      type: GoToTypes.ERROR,
      value: { type: GoToTypes.ERROR },
      isLoop: false,
    };
    if (!isNullOrUndefined(sequence)) {
      const rootStep: SequenceStepCTO | undefined = sequence.sequenceStepCTOs.find(
        (step) => step.squenceStepTO.root === true
      );
      const rootCond: ConditionTO | undefined = sequence.conditions.find((cond) => cond.root === true);
      if (!rootStep && !rootCond) {
        handleError("No Root element found in Sequence!");
      }
      if (rootStep && !rootCond) {
        root.type = GoToTypes.STEP;
        root.value = rootStep;
      }
      if (rootCond && !rootStep) {
        root.type = GoToTypes.COND;
        root.value = rootCond;
      }
    }
    return root;
  };

  const setGoToAsNode = (goto: GoTo, parentId: string, parentIds: string[]): NodeModel => {
    let nodeModel: NodeModel = {
      id: "",
      label: "",
      leafType: goto.type,
      parentId: parentId,
      childs: [],
    };
    if (!isNullOrUndefined(sequence)) {
      switch (goto.type) {
        case GoToTypes.STEP:
          let step: SequenceStepCTO | null =
            sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === goto.id) || null;
          if (step) {
            let prefix: string = "_STEP_" + step.squenceStepTO.id;
            nodeModel.id = parentId + prefix;
            nodeModel.label = step.squenceStepTO.name;
            if (!parentId.includes(prefix)) {
              parentIds.push(nodeModel.id);
              nodeModel.childs.push(setGoToAsNode(step.squenceStepTO.goto, nodeModel.id, parentIds));
            }
          }
          break;
        case GoToTypes.COND:
          let cond: ConditionTO | null = sequence.conditions.find((cond) => cond.id === goto.id) || null;
          if (cond) {
            let prefix: string = "_COND_" + cond.id;
            nodeModel.id = parentId + prefix;
            nodeModel.label = cond.name;

            if (!parentId.includes(prefix)) {
              parentIds.push(nodeModel.id);
              nodeModel.childs.push(setGoToAsNode(cond.ifGoTo, nodeModel.id, parentIds));
              nodeModel.childs.push(setGoToAsNode(cond.elseGoTo, nodeModel.id, parentIds));
            }
            break;
          }
          break;
        case GoToTypes.ERROR:
          nodeModel.id = parentId + "_ERROR";
          break;
        case GoToTypes.FIN:
          nodeModel.id = parentId + "_FIN";
          break;
      }
    }
    return nodeModel;
  };

  const buildNodeModelTree = (node: Node): NodeModel => {
    let parentIds: string[] = [];
    let nodeModel: NodeModel = { id: "root", label: "", leafType: node.type, childs: [] };
    switch (node.type) {
      case GoToTypes.STEP:
        parentIds.push(nodeModel.id);
        nodeModel.label = (node.value as SequenceStepCTO).squenceStepTO.name;
        nodeModel.childs.push(
          setGoToAsNode((node.value as SequenceStepCTO).squenceStepTO.goto, nodeModel.id, parentIds)
        );
        break;
      case GoToTypes.COND:
        parentIds.push(nodeModel.id);
        nodeModel.label = (node.value as ConditionTO).name;
        nodeModel.childs.push(setGoToAsNode((node.value as ConditionTO).ifGoTo, nodeModel.id, parentIds));
        nodeModel.childs.push(setGoToAsNode((node.value as ConditionTO).elseGoTo, nodeModel.id, parentIds));
        break;
    }
    return nodeModel;
  };

  // const getSequence = (): SequenceCTO | null => {
  //   if (sequence !== null) {
  //     return sequence;
  //   }
  //   if (sequenceToEdit !== null) {
  //     return dispatch(EditActions.sequence.findCTO(sequenceToEdit.id));
  //   }
  //   return null;
  // };

  const getSteps = (): string[] => {
    let copyStepIds: string[] = Carv2Util.deepCopy(stepIds);
    copyStepIds.push("root");
    return copyStepIds;
  };

  const getCurrentStep = (): CalculatedStep | undefined => {
    if (calcSteps.length > 0) {
      return calcSteps.find((step) => step.stepFk === stepIndex);
    } else {
      return undefined;
    }
  };

  return {
    nodeModelTree: buildNodeModelTree(getRoot(getSequence())),
  };
};
