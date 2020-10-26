import { SequenceCTO } from '../dataAccess/access/cto/SequenceCTO';
import { SequenceStepCTO } from '../dataAccess/access/cto/SequenceStepCTO';
import { ActionTO } from '../dataAccess/access/to/ActionTO';
import { DecisionTO } from '../dataAccess/access/to/DecisionTO';
import { GoTo, GoToTypes, Terminal } from '../dataAccess/access/types/GoToType';
import { SequenceActionReducer, SequenceActionResult } from '../reducer/SequenceActionReducer';
import { ActorData } from '../viewDataTypes/ActorData';

export interface CalculatedStep {
  stepFk: number;
  stepId: string;
  actorDatas: ActorData[];
  errors: ActionTO[];
}

export interface CalcSequence {
  sequenceModel: SequenceCTO | null;
  stepIds: string[];
  steps: CalculatedStep[];
  terminal: Terminal;
  loopStartingStepIndex?: number;
}

export const SequenceService = {
  calculateSequence: (sequence: SequenceCTO | null, dataSetup: ActorData[]): CalcSequence => {
    let calcSequence: CalcSequence = {
      sequenceModel: sequence,
      stepIds: [],
      steps: [],
      terminal: { type: GoToTypes.ERROR },
    };
    let stepIds: string[] = [];
    let loopStartingStep: number = -1;

    if (sequence && dataSetup) {
      let actorDatas: ActorData[] = dataSetup;
      calcSequence.steps.push(getInitStep(actorDatas));

      const root: SequenceStepCTO | DecisionTO | undefined = getRoot(sequence);

      if (root !== undefined) {
        let stepOrDecision: SequenceStepCTO | DecisionTO | Terminal = root;
        let type = getType(stepOrDecision);
        let stepId: string = "root";

        // calc next step or decision if not looping.
        while (!isLooping(loopStartingStep) && (type === GoToTypes.STEP || type === GoToTypes.DEC)) {
          // calc next step.
          if (type === GoToTypes.STEP) {
            const step: SequenceStepCTO = stepOrDecision as SequenceStepCTO;
            const result: SequenceActionResult = calculateStep(step, actorDatas);
            actorDatas = result.actorDatas;

            loopStartingStep = checkForLoop(calcSequence, step, result);

            const newStepId = "_STEP_" + step.squenceStepTO.id;
            stepId = stepId + newStepId;
            stepIds.push(stepId);

            calcSequence.steps.push({
              stepId: stepId,
              actorDatas: actorDatas,
              errors: result.errors,
              stepFk: step.squenceStepTO.id,
            });

            if (!isLooping(loopStartingStep)) {
              // set next object.
              stepOrDecision = getNext((stepOrDecision as SequenceStepCTO).squenceStepTO.goto, sequence);
              type = getType(stepOrDecision);
            }
          }

          // calc next decision
          if (type === GoToTypes.DEC) {
            const decision: DecisionTO = stepOrDecision as DecisionTO;

            const goTo: GoTo = SequenceActionReducer.executeDecisionCheck(decision, actorDatas);
            stepOrDecision = getNext(goTo, sequence);
            type = getType(stepOrDecision);

            const newCondID = "_COND_" + decision.id;
            stepId = stepId + newCondID;
            stepIds.push(stepId);
          }
        }
        if (!isLooping(loopStartingStep)) {
          calcSequence.terminal = stepOrDecision as Terminal;
          stepIds.push(stepId + "_" + (stepOrDecision as Terminal).type);
        }
      }
    }
    return {
      ...calcSequence,
      stepIds: stepIds,
      loopStartingStepIndex: isLooping(loopStartingStep) ? loopStartingStep : undefined,
    };
  },
};

const getInitStep = (actorDatas: ActorData[]): CalculatedStep => {
  return { stepId: "root", actorDatas: actorDatas, stepFk: 0, errors: [] };
};

const getStepFromSequence = (stepId: number, sequence: SequenceCTO): SequenceStepCTO | undefined => {
  return sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === stepId);
};

const getDecisionFromSequence = (id: number, sequence: SequenceCTO): DecisionTO | undefined => {
  return sequence.decisions.find((cond) => cond.id === id);
};

const getRoot = (sequence: SequenceCTO): SequenceStepCTO | DecisionTO | undefined => {
  const step: SequenceStepCTO | undefined = sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.root);
  const cond: DecisionTO | undefined = sequence.decisions.find((cond) => cond.root);
  return step ? step : cond ? cond : undefined;
};

const getNext = (goTo: GoTo, sequence: SequenceCTO): SequenceStepCTO | DecisionTO | Terminal => {
  let nextStepOrDecisionOrTerminal: SequenceStepCTO | DecisionTO | Terminal = { type: GoToTypes.ERROR };
  switch (goTo.type) {
    case GoToTypes.STEP:
      nextStepOrDecisionOrTerminal = getStepFromSequence(goTo.id, sequence) || { type: GoToTypes.ERROR };
      break;
    case GoToTypes.DEC:
      nextStepOrDecisionOrTerminal = getDecisionFromSequence(goTo.id, sequence) || { type: GoToTypes.ERROR };
      break;
    case GoToTypes.FIN:
      nextStepOrDecisionOrTerminal = { type: GoToTypes.FIN };
      break;
    case GoToTypes.IDLE:
      nextStepOrDecisionOrTerminal = { type: GoToTypes.IDLE };
      break;
    default:
      nextStepOrDecisionOrTerminal = { type: GoToTypes.ERROR };
  }
  return nextStepOrDecisionOrTerminal;
};

const calculateStep = (step: SequenceStepCTO, actorDatas: ActorData[]): SequenceActionResult => {
  return SequenceActionReducer.executeActionsOnActorDatas(step.actions, actorDatas);
};

const getType = (stepOrDecisionOrTerminal: SequenceStepCTO | DecisionTO | Terminal): GoToTypes => {
  if ((stepOrDecisionOrTerminal as SequenceStepCTO).squenceStepTO) {
    return GoToTypes.STEP;
  } else if ((stepOrDecisionOrTerminal as DecisionTO).elseGoTo) {
    return GoToTypes.DEC;
  } else if ((stepOrDecisionOrTerminal as Terminal).type) {
    return (stepOrDecisionOrTerminal as Terminal).type;
  } else {
    throw Error("Illegal Type in Sequence");
  }
};

const checkForLoop = (calcSequence: CalcSequence, step: SequenceStepCTO, result: SequenceActionResult): number => {
  return calcSequence.steps.findIndex(
    (calcStep) =>
      calcStep.stepFk === step.squenceStepTO.id &&
      calcStep.actorDatas.length === result.actorDatas.length &&
      !calcStep.actorDatas.some(
        (cp) => !result.actorDatas.some((rcp) => rcp.actorFk === cp.actorFk && rcp.dataFk === cp.dataFk)
      )
  );
};

const isLooping = (loopStartingStep: number) => {
  return loopStartingStep > -1;
};
