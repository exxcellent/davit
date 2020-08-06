/* eslint-disable no-case-declarations */
import React, { FunctionComponent } from "react";
import { ArcherContainer, ArcherElement, Relation } from "react-archer";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../dataAccess/access/cto/SequenceStepCTO";
import { ConditionTO } from "../../dataAccess/access/to/ConditionTO";
import { SequenceTO } from "../../dataAccess/access/to/SequenceTO";
import { GoTo, GoToTypes, Terminal } from "../../dataAccess/access/types/GoToType";
import { EditActions, editSelectors } from "../../slices/EditSlice";
import { handleError } from "../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../slices/SequenceModelSlice";

interface SequenceModelControllerProps {
  fullScreen?: boolean;
}

export const SequenceModelController: FunctionComponent<SequenceModelControllerProps> = (props) => {
  const { fullScreen } = props;
  const { sequenceName, nodeModelTree } = useFlowChartViewModel();

  const buildChart = (node: NodeModel): JSX.Element => {
    const rel: Relation[] = [];

    if (node.parentId) {
      rel.push({
        targetId: node.parentId,
        targetAnchor: "bottom",
        sourceAnchor: "top",
        style: { strokeColor: "black", strokeWidth: 1 },
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
          // border: "1px solid black",
        }}
      >
        <ArcherElement id={node.id} relations={rel}>
          <div className={node.id === "root" ? "ROOT" : node.leafType}>
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

  return (
    <div className={fullScreen ? "fullscreen" : "sequencModel"}>
      <div style={{ paddingLeft: "15px", color: "var(--carv2-text-color)" }}>{sequenceName}</div>
      {buildFlowChart()}
    </div>
  );
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
  const dispatch = useDispatch();
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const sequenceToEdit: SequenceTO | null = useSelector(editSelectors.sequenceToEdit);

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
            // nodeModel.label = step.squenceStepTO.id.toString();
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
            // nodeModel.label = cond.id.toString();

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
        // nodeModel.id = "STEP_" + (node.value as SequenceStepCTO).squenceStepTO.id;
        parentIds.push(nodeModel.id);
        nodeModel.label = (node.value as SequenceStepCTO).squenceStepTO.name;
        // nodeModel.label = (node.value as SequenceStepCTO).squenceStepTO.id.toString();
        nodeModel.childs.push(
          setGoToAsNode((node.value as SequenceStepCTO).squenceStepTO.goto, nodeModel.id, parentIds)
        );
        break;
      case GoToTypes.COND:
        // nodeModel.id = "COND_" + (node.value as ConditionTO).id;
        parentIds.push(nodeModel.id);
        nodeModel.label = (node.value as ConditionTO).name;
        // nodeModel.label = nodeModel.id;
        nodeModel.childs.push(setGoToAsNode((node.value as ConditionTO).ifGoTo, nodeModel.id, parentIds));
        nodeModel.childs.push(setGoToAsNode((node.value as ConditionTO).elseGoTo, nodeModel.id, parentIds));
        break;
    }
    return nodeModel;
  };

  const getSequence = (): SequenceCTO | null => {
    if (sequence !== null) {
      return sequence;
    }
    if (sequenceToEdit !== null) {
      return dispatch(EditActions.sequence.findCTO(sequenceToEdit.id));
    }
    return null;
  };

  return {
    sequenceName: sequence?.sequenceTO.name ? sequence.sequenceTO.name : "Select sequence...",
    nodeModelTree: buildNodeModelTree(getRoot(getSequence())),
  };
};
