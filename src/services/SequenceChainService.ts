import { isNullOrUndefined } from 'util';

import { ChainCTO } from '../dataAccess/access/cto/ChainCTO';
import { ChainlinkCTO } from '../dataAccess/access/cto/ChainlinkCTO';
import { DataSetupCTO } from '../dataAccess/access/cto/DataSetupCTO';
import { ChainDecisionTO } from '../dataAccess/access/to/ChainDecisionTO';
import { GoToChain, GoToTypesChain, TerminalChain } from '../dataAccess/access/types/GoToTypeChain';
import { ActorData } from '../viewDataTypes/ActorData';
import { CalcSequence, SequenceService } from './SequenceService';




















export interface CalcChainLink {
  name: string;
  chainLinkId: number;
  stepId: string;
  dataSetup: DataSetupCTO;
  sequence: CalcSequence;
  errors: ActorData[];
}

export interface CalcChain {
  calcLinks: CalcChainLink[];
  linkIds: string[];
  loopStartingIndex?: number;
  terminal: TerminalChain;
}

interface MergedActorDatas {
  actorDatas: ActorData[];
  errors: ActorData[];
}

export const SequenceChainService = {
  calculateChain: (sequenceChain: ChainCTO | null): CalcChain => {
    let calcSequenceChain: CalcChain = { calcLinks: [], linkIds: [], terminal: { type: GoToTypesChain.ERROR } };
    let loopStartingStep: number = -1;
    let actorDatas: ActorData[] = [];

    if (sequenceChain) {
      const root: ChainlinkCTO | null = getRoot(sequenceChain);

      if (root) {
        let step: ChainlinkCTO | ChainDecisionTO | TerminalChain = root;
        let type = getType(step);
        let stepId: string = "";

        while (!isLooping(loopStartingStep) && (type === GoToTypesChain.LINK || type === GoToTypesChain.DEC)) {
          if (type === GoToTypesChain.LINK) {
            const link: ChainlinkCTO = step as ChainlinkCTO;
            const mergedActorDatas: MergedActorDatas = mergeActorDatas(actorDatas, link.dataSetup);

            loopStartingStep = checkForLoop(calcSequenceChain, link, mergedActorDatas);

            const result: CalcSequence = SequenceService.calculateSequence(
              link.sequence,
              mergedActorDatas.actorDatas
            );

            actorDatas = result.steps.length > 0 ? result.steps[result.steps.length - 1].actorDatas : [];

            // STEP ID
            const newLinkId = "_LINK_" + link.chainLink.id;
            stepId = stepId === "" ? link.chainLink.id.toString() : stepId + newLinkId;
            calcSequenceChain.linkIds.push(stepId);

            calcSequenceChain.calcLinks.push({
              name: link.chainLink.name,
              chainLinkId: link.chainLink.id,
              stepId: stepId,
              sequence: result,
              dataSetup: link.dataSetup,
              errors: mergedActorDatas.errors,
            });

            if (!isLooping(loopStartingStep)) {
              // set next object.
              step = getNext((step as ChainlinkCTO).chainLink.goto, sequenceChain);
              type = getType(step);
            }
          }

          if (type === GoToTypesChain.DEC) {
            const decision: ChainDecisionTO = step as ChainDecisionTO;

            const goTo: GoToChain = executeDecisionCheck(decision, actorDatas);
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
    }
    return { ...calcSequenceChain, loopStartingIndex: isLooping(loopStartingStep) ? loopStartingStep : undefined };
  },
};

const executeDecisionCheck = (decision: ChainDecisionTO, actorDatas: ActorData[]): GoToChain => {
  const filteredCompData: ActorData[] = actorDatas.filter(
    (actorData) => actorData.actorFk === decision.actorFk
  );
  let goTo: GoToChain | undefined;
  if(decision.dataAndInstaceIds !== undefined){
    decision.dataAndInstaceIds.forEach((dataAndInstaceId) => {
      let isIncluded: boolean = filteredCompData.some((cd) => cd.dataFk === dataAndInstaceId.dataFk);
      if (decision.has !== isIncluded) {
        goTo = decision.elseGoTo;
      }
    });
  }
  return goTo || decision.ifGoTo;
};

const getLinkFromChain = (linkId: number, chain: ChainCTO): ChainlinkCTO | undefined => {
  return chain.links.find((link) => link.chainLink.id === linkId);
};

const getDecisionFromChain = (id: number, chain: ChainCTO): ChainDecisionTO | undefined => {
  return chain.decisions.find((decision) => decision.id === id);
};

export const getRoot = (chain: ChainCTO | null): ChainlinkCTO | null => {
  let rootLink: ChainlinkCTO | null = null;
  if (!isNullOrUndefined(chain)) {
    rootLink = chain.links.find((link) => link.chainLink.root === true) || null;
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
  mergedActorData: MergedActorDatas
): number => {
  return calcSequenceChain.calcLinks.findIndex(
    (calcLink) =>
      calcLink.chainLinkId === step.chainLink.id &&
      calcLink.sequence.steps[0].actorDatas.length === mergedActorData.actorDatas.length &&
      !calcLink.sequence.steps[0].actorDatas.some(
        (cp) =>
          !mergedActorData.actorDatas.some((rcp) => rcp.actorFk === cp.actorFk && rcp.dataFk === cp.dataFk)
      )
  );
};

const isLooping = (loopStartingStep: number) => {
  return loopStartingStep > -1;
};

const mergeActorDatas = (actorDatas: ActorData[], dataSetup: DataSetupCTO): MergedActorDatas => {
  const errorCompDatas: ActorData[] = [];
  const dataSetupActorData: ActorData[] = dataSetup.initDatas.map((initData) => {
    return { actorFk: initData.actorFk, dataFk: initData.dataFk, instanceFk: initData.instanceFk };
  });
  dataSetupActorData.forEach((actorData) => {
    if (actorDatas.some((cp) => isCompDataEqual(cp, actorData))) {
      errorCompDatas.push(actorData);
    } else {
      actorDatas.push(actorData);
    }
  });
  return { actorDatas: actorDatas, errors: errorCompDatas };
};

const isCompDataEqual = (actorData1: ActorData, actorData2: ActorData): boolean => {
  return actorData1.actorFk === actorData2.actorFk && actorData1.dataFk === actorData2.dataFk ? true : false;
};
