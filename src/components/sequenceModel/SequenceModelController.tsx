/* eslint-disable no-case-declarations */
import React, { FunctionComponent } from "react";
import { ArcherContainer, ArcherElement, Relation } from "react-archer";
import { useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../dataAccess/access/cto/SequenceStepCTO";
import { DecisionTO } from "../../dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes, Terminal } from "../../dataAccess/access/types/GoToType";
import { CalculatedStep } from "../../SequenceService";
import { handleError } from "../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../slices/SequenceModelSlice";
import { Carv2Util } from "../../utils/Carv2Util";

interface SequenceModelControllerProps {
  fullScreen?: boolean;
}

export const SequenceModelController: FunctionComponent<SequenceModelControllerProps> = (props) => {
  const { fullScreen } = props;
  const { nodeModelTree, calcSteps, lineColor, currentStep } = useFlowChartViewModel();

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
              ? lineColor()
              : "var(--carv2-background-color-header)",
          strokeWidth:
            calcSteps.find((step) => step === node.parentId) && calcSteps.find((step) => step === node.id) ? 5 : 3,
        },
      });
    }

    return (
      <div className="flowChartFlex" style={{ margin: node.id === "root" ? "" : "50px 0" }} key={node.id}>
        <ArcherElement id={node.id} relations={rel}>
          <div
            className={node.id === "root" ? "ROOT" : node.leafType}
            id={currentStep?.stepId === node.id ? "flowChartCurrentStep" : ""}
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
  value: SequenceStepCTO | DecisionTO | Terminal;
  isLoop: boolean;
  type: GoToTypes;
}

const useFlowChartViewModel = () => {
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
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
      const rootCond: DecisionTO | undefined = sequence.decisions.find((cond) => cond.root === true);
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
          let cond: DecisionTO | null = sequence.decisions.find((cond) => cond.id === goto.id) || null;
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
        case GoToTypes.IDLE:
          nodeModel.id = parentId + "_IDLE";
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
        nodeModel.label = (node.value as DecisionTO).name;
        nodeModel.childs.push(setGoToAsNode((node.value as DecisionTO).ifGoTo, nodeModel.id, parentIds));
        nodeModel.childs.push(setGoToAsNode((node.value as DecisionTO).elseGoTo, nodeModel.id, parentIds));
        break;
    }
    return nodeModel;
  };

  const getSteps = (): string[] => {
    let copyStepIds: string[] = Carv2Util.deepCopy(stepIds);
    return copyStepIds;
  };

  const getCurrentStep = (): CalculatedStep | undefined => {
    if (calcSteps.length > 0) {
      return calcSteps.find((step) => step.stepFk === stepIndex);
    } else {
      return undefined;
    }
  };

  const getLineColor = (): string => {
    if (terminalStep) {
      switch (terminalStep.type) {
        case GoToTypes.ERROR:
          return "var(--carv2-data-delete-color)";
        case GoToTypes.FIN:
          return "var(--carv2-data-add-color)";
        case GoToTypes.IDLE:
          return "var(--carv2-color-exxcellent-blue)";
      }
    } else {
      return "#FF00FF";
    }
  };

  return {
    nodeModelTree: buildNodeModelTree(getRoot(sequence)),
    currentStep: getCurrentStep(),
    calcSteps: getSteps(),
    lineColor: getLineColor,
  };
};
