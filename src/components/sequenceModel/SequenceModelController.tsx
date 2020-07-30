import React, { FunctionComponent } from "react";
import { ArcherContainer, ArcherElement, Relation } from "react-archer";
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

interface SequenceModelControllerProps {
  fullScreen?: boolean;
}

export const SequenceModelController: FunctionComponent<SequenceModelControllerProps> = (props) => {
  const { fullScreen } = props;
  const { sequenceName, buildFlowChart } = useFlowChartViewModel();

  // const rootStyle = { display: "flex", justifyContent: "space-around" };
  // const rowStyle = { margin: "200px 0", display: "flex", justifyContent: "space-between" };
  // const boxStyle = { padding: "10px", border: "1px solid black" };

  return (
    <div className={fullScreen ? "" : "sequencModel"}>
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

      {/* <ArcherContainer strokeColor="red">
        <div style={rootStyle}>
          <ArcherElement
            id="root"
            relations={[
              {
                targetId: "element2",
                targetAnchor: "top",
                sourceAnchor: "bottom",
              },
            ]}
          >
            <div style={boxStyle}>Root</div>
          </ArcherElement>
          <ArcherElement
            id="root2"
            relations={[
              {
                targetId: "element2",
                targetAnchor: "top",
                sourceAnchor: "bottom",
              },
            ]}
          >
            <div style={boxStyle}>Root</div>
          </ArcherElement>
        </div>

        <div style={rowStyle}>
          <ArcherElement
            id="element2"
            relations={[
              {
                targetId: "element3",
                targetAnchor: "left",
                sourceAnchor: "right",
                style: { strokeColor: "blue", strokeWidth: 1 },
                label: <div style={{ marginTop: "-20px" }}>Arrow 2</div>,
              },
            ]}
          >
            <div style={boxStyle}>Element 2</div>
          </ArcherElement>

          <ArcherElement id="element3">
            <div style={boxStyle}>Element 3</div>
          </ArcherElement>

          <ArcherElement
            id="element4"
            relations={[
              {
                targetId: "root",
                targetAnchor: "right",
                sourceAnchor: "left",
                label: "Arrow 3",
              },
            ]}
          >
            <div style={boxStyle}>Element 4</div>
          </ArcherElement>
        </div>
      </ArcherContainer> */}
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
  relationId1?: string;
  relationId2?: string;
}

interface Node {
  step: SequenceStepCTO | null;
  cond: ConditionTO | null;
  fin: boolean;
  error: boolean;
  loopBack: boolean;
  relationId1?: string;
  relationId2?: string;
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
      let step: SequenceStepCTO | null = null;
      let cond: ConditionTO | null = null;
      let fin: boolean = false;
      let error: boolean = false;
      let loopBack: boolean = false;
      switch (goto.type) {
        case GoToTypes.STEP:
          step = sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === goto.id) || null;
          break;
        case GoToTypes.COND:
          cond = sequence.conditions.find((cond) => cond.id === goto.id) || null;
          break;
        case GoToTypes.ERROR:
          error = true;
          break;
        case GoToTypes.FIN:
          fin = true;
          break;
      }
      node = { step: step, cond: cond, fin: fin, error: error, loopBack: loopBack };
    }

    return node;
  };

  const getNodeName = (node: Node): string => {
    let name: string = "";

    if (node.step !== null && node.cond === null) {
      name = node.step.squenceStepTO.name;
    }
    if (node.cond !== null && node.step === null) {
      name = node.cond.name;
    }

    if (node.error) {
      name = "ERROR";
    }

    if (node.fin) {
      name = "FIN";
    }

    return name;
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
        const relationNode: Node | null = setGoToAsNode(node.step.squenceStepTO.goto);
        let relationId1: string = "";
        if (relationNode) {
          relationId1 = getNodeName(relationNode);
        }

        nodeModes.push({
          name: node.step.squenceStepTO.name,
          leafType: LeafTyps.STEP,
          relationId1: relationId1,
        });
      }

      if (node.cond !== null) {
        const relation1Node: Node | null = setGoToAsNode(node.cond.ifGoTo);
        let relationId1: string = "";
        if (relation1Node) {
          relationId1 = getNodeName(relation1Node);
        }

        const relation2Node: Node | null = setGoToAsNode(node.cond.elseGoTo);
        let relationId2: string = "";
        if (relation2Node) {
          relationId2 = getNodeName(relation2Node);
        }

        nodeModes.push({
          name: node.cond.name,
          leafType: LeafTyps.COND,
          relationId1: relationId1,
          relationId2: relationId2,
        });
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
    const rel: Relation[] = [];
    if (node.relationId1) {
      rel.push({ targetId: node.relationId1, targetAnchor: "top", sourceAnchor: "bottom" });
    }
    if (node.relationId2) {
      rel.push({ targetId: node.relationId2, targetAnchor: "top", sourceAnchor: "bottom" });
    }
    return (
      <ArcherElement id={node.name} relations={rel}>
        <div className={getLeafClass(node.leafType)} style={{ padding: "10" }}>
          {node.name}
        </div>
      </ArcherElement>
    );
  };

  const buildRow = (nodes: NodeModel[]): JSX.Element => {
    return (
      // <div style={{ display: "flex", justifyContent: "space-around", margin: "10px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-around", margin: "50px 0" }}>
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
    return (
      <ArcherContainer noCurves={true} arrowLength={0}>
        {parsSequenceToNodes(getSequence()).map((nodes) => buildRow(nodes.nodes))}
      </ArcherContainer>
    );
  };

  return {
    sequenceName: sequence?.sequenceTO.name ? sequence.sequenceTO.name : "Select sequence...",
    buildFlowChart,
  };
};
