import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../dataAccess/access/cto/SequenceStepCTO";
import { ConditionTO } from "../../dataAccess/access/to/ConditionTO";
import { SequenceTO } from "../../dataAccess/access/to/SequenceTO";
import { GoTo, GoToTypes } from "../../dataAccess/access/types/GoToType";
import { EditActions, editSelectors } from "../../slices/EditSlice";
import { handleError } from "../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../slices/SequenceModelSlice";

interface SequenceModelControllerProps {}

export const SequenceModelController: FunctionComponent<SequenceModelControllerProps> = (props) => {
  const { sequenceName, buildFlowChart } = useFlowChartViewModel();

  return (
    <div className="sequencModel">
      <div style={{ display: "flex", justifyContent: "space-around", backgroundColor: "black" }}>
        <span style={{ color: "white", paddingLeft: "15px" }}>LEGEND:</span>
        <span style={{ color: "blue", paddingLeft: "15px" }}>STEP</span>
        <span style={{ color: "yellow", paddingLeft: "15px" }}>CONDITION</span>
        <span style={{ color: "green", paddingLeft: "15px" }}>FIN</span>
        <span style={{ color: "red", paddingLeft: "15px" }}>ERROR</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>{sequenceName}</div>
      {buildFlowChart()}
    </div>
  );
};

enum LeafTyps {
  STEP = "STEP",
  COND = "COND",
  FIN = "FIN",
  ERROR = "ERROR",
}

interface NodeModel {
  name: string;
  leafType: LeafTyps;
}

interface Node {
  step: SequenceStepCTO | null;
  cond: ConditionTO | null;
  fin: boolean;
  error: boolean;
}

// TODO: could be done also as NodeModel[][]?
interface nodeArray {
  nodes: NodeModel[];
}

const useFlowChartViewModel = () => {
  const dispatch = useDispatch();
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const sequenceToEdit: SequenceTO | null = useSelector(editSelectors.sequenceToEdit);

  const getRoot = (sequence: SequenceCTO): Node => {
    let root: Node = { step: null, cond: null, error: false, fin: false };
    if (!isNullOrUndefined(sequence)) {
      const rootStep: SequenceStepCTO | undefined = sequence.sequenceStepCTOs.find(
        (step) => step.squenceStepTO.root === true
      );
      const rootCond: ConditionTO | undefined = sequence.conditions.find((cond) => cond.root === true);
      if (!rootStep && !rootCond) {
        handleError("No Root element found in Sequence!");
      }
      if (rootStep && !rootCond) {
        root.step = rootStep;
      }
      if (rootCond && !rootStep) {
        root.cond = rootCond;
      }
    }
    return root;
  };

  const setGoToAsNode = (goto: GoTo): Node | null => {
    let node: Node | null = null;
    if (!isNullOrUndefined(sequence)) {
      switch (goto.type) {
        case GoToTypes.STEP:
          node = {
            step: sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === goto.id) || null,
            cond: null,
            fin: false,
            error: false,
          };
          break;
        case GoToTypes.COND:
          node = {
            step: null,
            cond: sequence.conditions.find((cond) => cond.id === goto.id) || null,
            fin: false,
            error: false,
          };
          break;
        case GoToTypes.ERROR:
          node = {
            step: null,
            cond: null,
            fin: false,
            error: true,
          };
          break;
        case GoToTypes.FIN:
          node = {
            step: null,
            cond: null,
            fin: true,
            error: false,
          };
          break;
      }
    }

    return node;
  };

  const setNextNodes = (nodes: Node[]): Node[] => {
    let newNodes: Node[] = [];

    nodes.forEach((node) => {
      if (node.step !== null && node.cond === null) {
        const newNode: Node | null = setGoToAsNode(node.step.squenceStepTO.goto);
        if (newNode) {
          newNodes.push(newNode);
        }
      }
      if (node.cond !== null && node.step === null) {
        const ifNode: Node | null = setGoToAsNode(node.cond.ifGoTo);
        if (ifNode) {
          newNodes.push(ifNode);
        }
        const elseNode: Node | null = setGoToAsNode(node.cond.elseGoTo);
        if (elseNode) {
          newNodes.push(elseNode);
        }
      }
    });

    return newNodes;
  };

  const parsNodeArrayToNodeModelArray = (nodes: Node[]): NodeModel[] => {
    let nodeModes: NodeModel[] = [];

    nodes.forEach((node) => {
      if (node.step !== null) {
        nodeModes.push({ name: node.step.squenceStepTO.name, leafType: LeafTyps.STEP });
      }
      if (node.cond !== null) {
        nodeModes.push({ name: node.cond.name, leafType: LeafTyps.COND });
      }
      if (node.error === true) {
        nodeModes.push({ name: "ERROR", leafType: LeafTyps.ERROR });
      }
      if (node.fin === true) {
        nodeModes.push({ name: "FIN", leafType: LeafTyps.FIN });
      }
    });

    return nodeModes;
  };

  const parsSequenceToNodes = (sequence: SequenceCTO | null): nodeArray[] => {
    let nodeModels: nodeArray[] = [];
    if (sequence !== null) {
      // get root
      const root: Node = getRoot(sequence);
      let nodes: Node[] = [root];
      let hasNext = true;
      while (hasNext) {
        // push nodes to array
        nodeModels.push({ nodes: parsNodeArrayToNodeModelArray(nodes) });
        // get next nodes
        nodes = setNextNodes(nodes);
        if (nodes.length <= 0) {
          hasNext = false;
        }
      }
    }
    return nodeModels;
  };

  const getLeafColor = (leafType: LeafTyps): string => {
    switch (leafType) {
      case LeafTyps.COND:
        return "yellow";
      case LeafTyps.STEP:
        return "blue";
      case LeafTyps.ERROR:
        return "red";
      case LeafTyps.FIN:
        return "green";
    }
  };

  const buildChart = (node: NodeModel): JSX.Element => {
    return (
      <div
        style={{
          border: "1px solid black",
          backgroundColor: getLeafColor(node.leafType),
          padding: "0.2em",
          borderRadius: "5px",
          position: "absolute",
        }}
      >
        {node.name}
      </div>
    );
  };

  const buildRow = (nodes: NodeModel[]): JSX.Element => {
    return (
      <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "1em" }}>
        {nodes.map((node) => buildChart(node))}
      </div>
    );
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

  const buildFlowChart = (): JSX.Element => {
    return <div>{parsSequenceToNodes(getSequence()).map((nodes) => buildRow(nodes.nodes))}</div>;
  };

  return { sequenceName: sequence?.sequenceTO.name ? sequence.sequenceTO.name : "Select sequence...", buildFlowChart };
};
