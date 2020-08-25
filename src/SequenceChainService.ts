import { ChainCTO } from "./dataAccess/access/cto/ChainCTO";
import { ChainlinkCTO } from "./dataAccess/access/cto/ChainlinkCTO";
import { DataSetupCTO } from "./dataAccess/access/cto/DataSetupCTO";
import { ChainDecisionTO } from "./dataAccess/access/to/ChainDecisionTO";
import { GoToChain, GoToTypesChain, TerminalChain } from "./dataAccess/access/types/GoToTypeChain";
import { CalcSequence, SequenceService } from "./SequenceService";
import { ComponentData } from "./viewDataTypes/ComponentData";

export interface CalcChainLink {
  name: string;
  chainLinkId: number;
  stepId: string;
  dataSetup: DataSetupCTO;
  sequence: CalcSequence;
  errors: ComponentData[];
}

export interface CalcChain {
  calcLinks: CalcChainLink[];
  linkIds: string[];
  loopStartingIndex?: number;
  terminal: TerminalChain;
}

interface MergedComponentDatas {
  componentDatas: ComponentData[];
  errors: ComponentData[];
}

export const SequenceChainService = {
  calculateChain: (sequenceChain: ChainCTO | null): CalcChain => {
    let calcSequenceChain: CalcChain = { calcLinks: [], linkIds: [], terminal: { type: GoToTypesChain.ERROR } };
    let loopStartingStep: number = -1;
    let componenentDatas: ComponentData[] = [];

    if (sequenceChain) {
      const root: ChainlinkCTO = getRoot(sequenceChain);

      let step: ChainlinkCTO | ChainDecisionTO | TerminalChain = root;
      let type = getType(step);
      let stepId: string = "";

      while (!isLooping(loopStartingStep) && (type === GoToTypesChain.LINK || type === GoToTypesChain.DEC)) {
        if (type === GoToTypesChain.LINK) {
          const link: ChainlinkCTO = step as ChainlinkCTO;
          const mergedComponentDatas: MergedComponentDatas = mergeComponentDatas(componenentDatas, link.dataSetup);

          loopStartingStep = checkForLoop(calcSequenceChain, link, mergedComponentDatas);

          const result: CalcSequence = SequenceService.calculateSequence(
            link.sequence,
            mergedComponentDatas.componentDatas
          );

          componenentDatas = result.steps.length > 0 ? result.steps[result.steps.length - 1].componentDatas : [];

          // STEP ID
          const newLinkId = "_LINK_" + link.chainLink.id;
          stepId = stepId === "" ? "root" : stepId + newLinkId;
          calcSequenceChain.linkIds.push(stepId);

          calcSequenceChain.calcLinks.push({
            name: link.chainLink.name,
            chainLinkId: link.chainLink.id,
            stepId: stepId,
            sequence: result,
            dataSetup: link.dataSetup,
            errors: mergedComponentDatas.errors,
          });

          if (!isLooping(loopStartingStep)) {
            // set next object.
            step = getNext((step as ChainlinkCTO).chainLink.goto, sequenceChain);
            type = getType(step);
          }
        }

        if (type === GoToTypesChain.DEC) {
          const decision: ChainDecisionTO = step as ChainDecisionTO;

          const goTo: GoToChain = executeDecisionCheck(decision, componenentDatas);
          step = getNext(goTo, sequenceChain);
          type = getType(step);

          const newCondID = "_COND_" + decision.id;
          stepId = stepId === "" ? "root" : stepId + newCondID;
        }
      }
      if (!isLooping(loopStartingStep)) {
        calcSequenceChain.terminal = step as TerminalChain;
        calcSequenceChain.linkIds.push(stepId + "_" + (step as TerminalChain).type);
      }
    }
    return { ...calcSequenceChain, loopStartingIndex: isLooping(loopStartingStep) ? loopStartingStep : undefined };
  },
};

const executeDecisionCheck = (decision: ChainDecisionTO, componenDatas: ComponentData[]): GoToChain => {
  const filteredCompData: ComponentData[] = componenDatas.filter(
    (compData) => compData.componentFk === decision.componentFk
  );
  let goTo: GoToChain | undefined;
  decision.dataFks.forEach((dataFk) => {
    let isIncluded: boolean = filteredCompData.some((cd) => cd.dataFk === dataFk);
    if (decision.has !== isIncluded) {
      goTo = decision.elseGoTo;
    }
  });
  return goTo || decision.ifGoTo;
};

const getLinkFromChain = (linkId: number, chain: ChainCTO): ChainlinkCTO | undefined => {
  return chain.links.find((link) => link.chainLink.id === linkId);
};

const getDecisionFromChain = (id: number, chain: ChainCTO): ChainDecisionTO | undefined => {
  return chain.decisions.find((decision) => decision.id === id);
};

const getRoot = (chain: ChainCTO): ChainlinkCTO => {
  const rootLink: ChainlinkCTO | undefined = chain.links.find((link) => link.chainLink.root === true);
  if (!rootLink) {
    throw Error("No Root found in Chain!");
  }
  return rootLink;
};

const getNext = (goTo: GoToChain, chain: ChainCTO): ChainlinkCTO | ChainDecisionTO | TerminalChain => {
  let nextStepOrDecisionOrTerminal: ChainlinkCTO | ChainDecisionTO | TerminalChain = { type: GoToTypesChain.ERROR };
  switch (goTo.type) {
    case GoToTypesChain.LINK:
      nextStepOrDecisionOrTerminal = getLinkFromChain(goTo.id, chain) || { type: GoToTypesChain.ERROR };
      break;
    case GoToTypesChain.DEC:
      nextStepOrDecisionOrTerminal = getDecisionFromChain(goTo.id, chain) || { type: GoToTypesChain.ERROR };
      break;
    case GoToTypesChain.FIN:
      nextStepOrDecisionOrTerminal = { type: GoToTypesChain.FIN };
  }
  return nextStepOrDecisionOrTerminal;
};

const getType = (step: ChainlinkCTO | ChainDecisionTO | TerminalChain): GoToTypesChain => {
  if ((step as ChainlinkCTO).chainLink) {
    return GoToTypesChain.LINK;
  } else if ((step as ChainDecisionTO).elseGoTo) {
    return GoToTypesChain.DEC;
  } else if ((step as TerminalChain).type) {
    return (step as TerminalChain).type;
  } else {
    throw Error("Illegal Type in Sequence");
  }
};

const checkForLoop = (
  calcSequenceChain: CalcChain,
  step: ChainlinkCTO,
  mergedCompData: MergedComponentDatas
): number => {
  return calcSequenceChain.calcLinks.findIndex(
    (calcLink) =>
      calcLink.chainLinkId === step.chainLink.id &&
      calcLink.sequence.steps[0].componentDatas.length === mergedCompData.componentDatas.length &&
      !calcLink.sequence.steps[0].componentDatas.some(
        (cp) =>
          !mergedCompData.componentDatas.some((rcp) => rcp.componentFk === cp.componentFk && rcp.dataFk === cp.dataFk)
      )
  );
};

const isLooping = (loopStartingStep: number) => {
  return loopStartingStep > -1;
};

const mergeComponentDatas = (compDatas: ComponentData[], dataSetup: DataSetupCTO): MergedComponentDatas => {
  const errorCompDatas: ComponentData[] = [];
  const dataSetupCompData: ComponentData[] = dataSetup.initDatas.map((initData) => {
    return { componentFk: initData.componentFk, dataFk: initData.dataFk };
  });
  dataSetupCompData.forEach((compData) => {
    if (compDatas.some((cp) => isCompDataEqual(cp, compData))) {
      errorCompDatas.push(compData);
    } else {
      compDatas.push(compData);
    }
  });
  return { componentDatas: compDatas, errors: errorCompDatas };
};

const isCompDataEqual = (compData1: ComponentData, compData2: ComponentData): boolean => {
  return compData1.componentFk === compData2.componentFk && compData1.dataFk === compData2.dataFk ? true : false;
};
