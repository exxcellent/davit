/* eslint-disable no-case-declarations */
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { ArcherContainer, ArcherElement, Relation } from "react-archer";
import { useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ChainCTO } from "../../dataAccess/access/cto/ChainCTO";
import { ChainlinkCTO } from "../../dataAccess/access/cto/ChainlinkCTO";
import { SequenceCTO } from "../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../dataAccess/access/cto/SequenceStepCTO";
import { ChainDecisionTO } from "../../dataAccess/access/to/ChainDecisionTO";
import { DecisionTO } from "../../dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes, Terminal } from "../../dataAccess/access/types/GoToType";
import { GoToChain, GoToTypesChain, TerminalChain } from "../../dataAccess/access/types/GoToTypeChain";
import { CalculatedStep } from "../../SequenceService";
import { handleError } from "../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../slices/SequenceModelSlice";
import { Carv2Util } from "../../utils/Carv2Util";
import { TabFragment } from "../sequenceTableModel/fragments/TabFragment";
import { TabGroupFragment } from "../sequenceTableModel/fragments/TabGroupFragment";

interface SequenceModelControllerProps {
  fullScreen?: boolean;
}

export const SequenceModelController: FunctionComponent<SequenceModelControllerProps> = (props) => {
  const { fullScreen } = props;
  const { nodeModelTree, calcSteps, lineColor, currentStep, nodeModelChainTree } = useFlowChartViewModel();

  const [showChain, setShowChain] = useState<boolean>(false);

  const parentRef = useRef<HTMLDivElement>(null);

  const [tableHeight, setTabelHeihgt] = useState<number>(0);

  useEffect(() => {
    const resizeListener = () => {
      if (parentRef && parentRef.current) {
        setTabelHeihgt(parentRef.current.offsetHeight);
      }
    };

    resizeListener();
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [parentRef]);

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

  const buildChainChart = (node: NodeModelChain): JSX.Element => {
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
            {node.id === "root" || node.leafType === GoToTypesChain.DEC ? "" : node.label}
          </div>
        </ArcherElement>
        {node.leafType === GoToTypesChain.DEC && <div className="condLabel">{node.label}</div>}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "start",
            width: "100%",
          }}
        >
          {node.childs.map(buildChainChart)}
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

  const buildChainFlowChart = (): JSX.Element => {
    return (
      <ArcherContainer noCurves={true} arrowLength={0}>
        {buildChainChart(nodeModelChainTree)}
      </ArcherContainer>
    );
  };

  return (
    <div className={fullScreen ? "fullscreen" : "sequencModel"} ref={parentRef}>
      <div style={{ display: "flex", position: "absolute", zIndex: 1 }}>
        <TabGroupFragment label="Mode" style={{ backgroundColor: "var(--carv2-background-color-header)" }}>
          <TabFragment label="Chain" isActive={showChain} onClick={() => setShowChain(true)} />
          <TabFragment label="Sequence" isActive={!showChain} onClick={() => setShowChain(false)} />
        </TabGroupFragment>
      </div>
      <div className="flowChart" style={{ height: tableHeight }}>
        {!showChain && buildFlowChart()}
        {showChain && buildChainFlowChart()}
      </div>
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

interface NodeModelChain {
  parentId?: string;
  id: string;
  label: string;
  leafType: GoToTypesChain;
  childs: NodeModelChain[];
}

interface Node {
  value: SequenceStepCTO | DecisionTO | Terminal;
  isLoop: boolean;
  type: GoToTypes;
}

interface NodeChain {
  value: ChainlinkCTO | ChainDecisionTO | TerminalChain;
  isLoop: boolean;
  type: GoToTypesChain;
}

const useFlowChartViewModel = () => {
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
  const calcSteps: CalculatedStep[] = useSelector(sequenceModelSelectors.selectCalcSteps);
  const terminalStep: Terminal | null = useSelector(sequenceModelSelectors.selectTerminalStep);
  const stepIds: string[] = useSelector(sequenceModelSelectors.selectCalcStepIds);
  const chain: ChainCTO | null = useSelector(sequenceModelSelectors.selectChainCTO);

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

  const getChainRoot = (chain: ChainCTO | null): NodeChain => {
    let root: NodeChain = {
      type: GoToTypesChain.ERROR,
      value: { type: GoToTypesChain.ERROR },
      isLoop: false,
    };
    if (!isNullOrUndefined(chain)) {
      const rootStep: ChainlinkCTO | undefined = chain.links.find((link) => link.chainLink.root === true);
      const rootCond: ChainDecisionTO | undefined = chain.decisions.find((cond) => cond.root === true);
      if (!rootStep && !rootCond) {
        handleError("No Root element found in Sequence!");
      }
      if (rootStep && !rootCond) {
        root.type = GoToTypesChain.LINK;
        root.value = rootStep;
      }
      if (rootCond && !rootStep) {
        root.type = GoToTypesChain.DEC;
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

  const setGoToAsNodeChain = (goto: GoToChain, parentId: string, parentIds: string[]): NodeModelChain => {
    let nodeModel: NodeModelChain = {
      id: "",
      label: "",
      leafType: goto.type,
      parentId: parentId,
      childs: [],
    };
    if (!isNullOrUndefined(chain)) {
      switch (goto.type) {
        case GoToTypesChain.LINK:
          let link: ChainlinkCTO | null = chain.links.find((link) => link.chainLink.id === goto.id) || null;
          if (link) {
            let prefix: string = "_LINK_" + link.chainLink.id;
            nodeModel.id = parentId + prefix;
            nodeModel.label = link.chainLink.name;
            if (!parentId.includes(prefix)) {
              parentIds.push(nodeModel.id);
              nodeModel.childs.push(setGoToAsNodeChain(link.chainLink.goto, nodeModel.id, parentIds));
            }
          }
          break;
        case GoToTypesChain.DEC:
          let decision: ChainDecisionTO | null = chain.decisions.find((dec) => dec.id === goto.id) || null;
          if (decision) {
            let prefix: string = "_DEC_" + decision.id;
            nodeModel.id = parentId + prefix;
            nodeModel.label = decision.name;

            if (!parentId.includes(prefix)) {
              parentIds.push(nodeModel.id);
              nodeModel.childs.push(setGoToAsNodeChain(decision.ifGoTo, nodeModel.id, parentIds));
              nodeModel.childs.push(setGoToAsNodeChain(decision.elseGoTo, nodeModel.id, parentIds));
            }
            break;
          }
          break;
        case GoToTypesChain.ERROR:
          nodeModel.id = parentId + "_ERROR";
          break;
        case GoToTypesChain.FIN:
          nodeModel.id = parentId + "_FIN";
          break;
      }
    }
    return nodeModel;
  };

  const getDataSetup = (): Node => {
    let initData: Node = { isLoop: false, type: GoToTypes.STEP, value: new SequenceStepCTO() };
    if (sequence) {
      const root: Node = getRoot(sequence);
      if ((root.value as SequenceStepCTO).actions) {
        (initData.value as SequenceStepCTO).squenceStepTO.goto = {
          type: GoToTypes.STEP,
          id: (root.value as SequenceStepCTO).squenceStepTO.id,
        };
      }
      if ((root.value as DecisionTO).elseGoTo) {
        (initData.value as SequenceStepCTO).squenceStepTO.goto = {
          type: GoToTypes.COND,
          id: (root.value as DecisionTO).id,
        };
      }
      initData.isLoop = false;
    }
    return initData;
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

  const buildNodeModelChainTree = (node: NodeChain): NodeModelChain => {
    let parentIds: string[] = [];
    let nodeModel: NodeModelChain = { id: "root", label: "", leafType: node.type, childs: [] };
    switch (node.type) {
      case GoToTypesChain.LINK:
        parentIds.push(nodeModel.id);
        nodeModel.label = (node.value as ChainlinkCTO).chainLink.name;
        nodeModel.childs.push(setGoToAsNodeChain((node.value as ChainlinkCTO).chainLink.goto, nodeModel.id, parentIds));
        break;
      case GoToTypesChain.DEC:
        parentIds.push(nodeModel.id);
        nodeModel.label = (node.value as ChainDecisionTO).name;
        nodeModel.childs.push(setGoToAsNodeChain((node.value as ChainDecisionTO).ifGoTo, nodeModel.id, parentIds));
        nodeModel.childs.push(setGoToAsNodeChain((node.value as ChainDecisionTO).elseGoTo, nodeModel.id, parentIds));
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
    // nodeModelTree: buildNodeModelTree(getRoot(sequence)),
    nodeModelTree: buildNodeModelTree(getDataSetup()),
    nodeModelChainTree: buildNodeModelChainTree(getChainRoot(chain)),
    currentStep: getCurrentStep(),
    calcSteps: getSteps(),
    lineColor: getLineColor,
  };
};
