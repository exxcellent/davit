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
      <div className="legend">
        <span style={{ color: "white", paddingLeft: "15px" }}>LEGEND:</span>
        <span className="legendItem" style={{ backgroundColor: "blue" }}>
          STEP
        </span>
        <span className="legendItem" style={{ backgroundColor: "yellow" }}>
          CONDITION
        </span>
        <span className="legendItem" style={{ backgroundColor: "red" }}>
          ERROR
        </span>
        <span className="legendItem" style={{ backgroundColor: "green" }}>
          FIN
        </span>
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
  loopBack: boolean;
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
    let root: Node = { step: null, cond: null, error: false, fin: false, loopBack: false };
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
            loopBack: false,
          };
          break;
        case GoToTypes.COND:
          node = {
            step: null,
            cond: sequence.conditions.find((cond) => cond.id === goto.id) || null,
            fin: false,
            error: false,
            loopBack: false,
          };
          break;
        case GoToTypes.ERROR:
          node = {
            step: null,
            cond: null,
            fin: false,
            error: true,
            loopBack: false,
          };
          break;
        case GoToTypes.FIN:
          node = {
            step: null,
            cond: null,
            fin: true,
            error: false,
            loopBack: false,
          };
          break;
      }
    }

    return node;
  };

  const hasBeenOnNode = (node: Node, nodesBeen: Node[]): boolean => {
    let hasBeen: boolean = false;
    if (node.step !== null && node.cond === null) {
      if (nodesBeen.find((step) => step.step?.squenceStepTO.id === node.step?.squenceStepTO.id)) {
        hasBeen = true;
      }
    }
    if (node.cond !== null && node.step === null) {
      if (nodesBeen.find((cond) => cond.cond?.id === node.cond?.id)) {
        hasBeen = true;
      }
    }
    return hasBeen;
  };

  const setNextNodes = (nodes: Node[], nodesBeen: Node[]): Node[] => {
    let newNodes: Node[] = [];

    nodes.forEach((node) => {
      if (node.step !== null && node.cond === null && node.loopBack === false) {
        const newNode: Node | null = setGoToAsNode(node.step.squenceStepTO.goto);

        if (newNode) {
          // check if we are been on node
          // remove goto so we stop looping.
          newNode.loopBack = hasBeenOnNode(newNode, nodesBeen);
          newNodes.push(newNode);
        }
      }
      if (node.cond !== null && node.step === null && node.loopBack === false) {
        const ifNode: Node | null = setGoToAsNode(node.cond.ifGoTo);
        if (ifNode) {
          // check if we are been on node
          // remove goto so we stop looping.
          ifNode.loopBack = hasBeenOnNode(ifNode, nodesBeen);
          newNodes.push(ifNode);
        }
        const elseNode: Node | null = setGoToAsNode(node.cond.elseGoTo);
        if (elseNode) {
          // check if we are been on node
          // remove goto so we stop looping.
          elseNode.loopBack = hasBeenOnNode(elseNode, nodesBeen);
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
    let nodesBeen: Node[] = [];

    if (sequence !== null) {
      // get root
      const root: Node = getRoot(sequence);
      let nodes: Node[] = [root];
      let hasNext = true;

      while (hasNext) {
        // pars node to nodeModel and push nodes to array.
        nodeModels.push({ nodes: parsNodeArrayToNodeModelArray(nodes) });
        // count were we've been.
        nodes.forEach((node) => nodesBeen.push(node));
        // get next nodes
        nodes = setNextNodes(nodes, nodesBeen);
        if (nodes.length <= 0) {
          hasNext = false;
        }
      }
    }
    return nodeModels;
  };

  const getLeafClass = (leafType: LeafTyps): string => {
    switch (leafType) {
      case LeafTyps.COND:
        return "node cond";
      case LeafTyps.STEP:
        return "node step";
      case LeafTyps.ERROR:
        return "node error";
      case LeafTyps.FIN:
        return "node fin";
    }
  };

  const buildChart = (node: NodeModel): JSX.Element => {
    return <div className={getLeafClass(node.leafType)}>{node.name}</div>;
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

  return {
    sequenceName: sequence?.sequenceTO.name ? sequence.sequenceTO.name : "Select sequence...",
    buildFlowChart,
  };
};
