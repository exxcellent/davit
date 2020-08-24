import { SequenceCTO } from "./dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "./dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "./dataAccess/access/to/ActionTO";
import { DecisionTO } from "./dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes, Terminal } from "./dataAccess/access/types/GoToType";
import { SequenceActionReducer, SequenceActionResult } from "./reducer/SequenceActionReducer";
import { ComponentData } from "./viewDataTypes/ComponentData";

export interface CalculatedStep {
  stepFk: number;
  stepId: string;
  componentDatas: ComponentData[];
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
  calculateSequence: (sequence: SequenceCTO | null, dataSetup: ComponentData[]): CalcSequence => {
    let calcSequence: CalcSequence = {
      sequenceModel: sequence,
      stepIds: [],
      steps: [],
      terminal: { type: GoToTypes.ERROR },
    };
    let stepIds: string[] = [];
    let loopStartingStep: number = -1;

    if (sequence && dataSetup) {
      let componentDatas: ComponentData[] = dataSetup;
      calcSequence.steps.push(getInitStep(componentDatas));

      const root: SequenceStepCTO | DecisionTO | undefined = getRoot(sequence);

      if (root !== undefined) {
        let stepOrDecision: SequenceStepCTO | DecisionTO | Terminal = root;
        let type = getType(stepOrDecision);
        let stepId: string = "root";

        while (!isLooping(loopStartingStep) && (type === GoToTypes.STEP || type === GoToTypes.COND)) {
          if (type === GoToTypes.STEP) {
            const step: SequenceStepCTO = stepOrDecision as SequenceStepCTO;
            const result: SequenceActionResult = calculateStep(step, componentDatas);
            componentDatas = result.componenDatas;

            loopStartingStep = checkForLoop(calcSequence, step, result);

            // STEP ID
            const newStepId = "_STEP_" + step.squenceStepTO.id;
            stepId = stepId + newStepId;
            stepIds.push(stepId);

            calcSequence.steps.push({
              stepId: stepId,
              componentDatas: componentDatas,
              errors: result.errors,
              stepFk: step.squenceStepTO.id,
            });

            if (!isLooping(loopStartingStep)) {
              // set next object.
              stepOrDecision = getNext((stepOrDecision as SequenceStepCTO).squenceStepTO.goto, sequence);
              type = getType(stepOrDecision);
            }
          }

          if (type === GoToTypes.COND) {
            const decision: DecisionTO = stepOrDecision as DecisionTO;

            const goTo: GoTo = SequenceActionReducer.executeDecisionCheck(decision, componentDatas);
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

const getInitStep = (componenentDatas: ComponentData[]): CalculatedStep => {
  return { stepId: "", componentDatas: componenentDatas, stepFk: 0, errors: [] };
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
    case GoToTypes.COND:
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

const calculateStep = (step: SequenceStepCTO, componentDatas: ComponentData[]): SequenceActionResult => {
  return SequenceActionReducer.executeActionsOnComponentDatas(step.actions, componentDatas);
};

const getType = (stepOrDecisionOrTerminal: SequenceStepCTO | DecisionTO | Terminal): GoToTypes => {
  if ((stepOrDecisionOrTerminal as SequenceStepCTO).squenceStepTO) {
    return GoToTypes.STEP;
  } else if ((stepOrDecisionOrTerminal as DecisionTO).elseGoTo) {
    return GoToTypes.COND;
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
      calcStep.componentDatas.length === result.componenDatas.length &&
      !calcStep.componentDatas.some(
        (cp) => !result.componenDatas.some((rcp) => rcp.componentFk === cp.componentFk && rcp.dataFk === cp.dataFk)
      )
  );
};

const isLooping = (loopStartingStep: number) => {
  return loopStartingStep > -1;
};
