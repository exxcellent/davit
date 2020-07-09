import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { Arrows } from "../components/metaComponentModel/presentation/MetaComponentModelController";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { ConditionTO } from "../dataAccess/access/to/ConditionTO";
import { GoTo, GoToTypes, Terminal } from "../dataAccess/access/types/GoToType";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { SequenceActionReducer, SequenceActionResult } from "../reducer/SequenceActionReducer";
import { ComponentData } from "../viewDataTypes/ComponentData";
import { handleError } from "./GlobalSlice";

export interface CalculatedStep {
  stepFk: number;
  componentDatas: ComponentData[];
  errors: ActionTO[];
}

export interface CalcSequence {
  steps: CalculatedStep[];
  terminal: Terminal;
}

interface SequenceModelState {
  selectedSequenceModel: SequenceCTO | null;
  selectedDataSetup: DataSetupCTO | null;
  calcSequence: CalcSequence | null;
  loopStartingStepIndex: number | null;
  currentStepIndex: number;
  errorActions: ActionTO[];
  actions: ActionTO[];
  componentDatas: ComponentData[];
}
const getInitialState: SequenceModelState = {
  selectedSequenceModel: null,
  selectedDataSetup: null,
  loopStartingStepIndex: null,
  calcSequence: null,
  currentStepIndex: -1,
  errorActions: [],
  actions: [],
  componentDatas: [],
};

const SequenceModelSlice = createSlice({
  name: "sequenceModel",
  initialState: getInitialState,
  reducers: {
    setSelectedSequence: (state, action: PayloadAction<SequenceCTO | null>) => {
      state.selectedSequenceModel = action.payload;
      // TODO: in extra method und nur ausführen wenn sequence und datasetup gestezt sind sonst reset.
      const result: { sequence: CalcSequence; stepFk?: number } = calculateSequence(
        action.payload,
        state.selectedDataSetup
      );
      state.errorActions = result.sequence.steps[state.currentStepIndex].errors;
      state.componentDatas = result.sequence.steps[state.currentStepIndex].componentDatas;
      state.calcSequence = result.sequence;
      state.loopStartingStepIndex = result.stepFk || null;
    },
    setSelectedDataSetup: (state, action: PayloadAction<DataSetupCTO | null>) => {
      state.selectedDataSetup = action.payload;
      // TODO: in extra method und nur ausführen wenn sequence und datasetup gestezt sind sonst reset.
      const result: { sequence: CalcSequence; stepFk?: number } = calculateSequence(
        state.selectedSequenceModel,
        action.payload
      );
      state.errorActions = result.sequence.steps[state.currentStepIndex].errors;
      state.componentDatas = result.sequence.steps[state.currentStepIndex].componentDatas;
      state.calcSequence = result.sequence;
      state.loopStartingStepIndex = result.stepFk || null;
    },
    setCurrentStepIndex: (state, action: PayloadAction<number>) => {
      state.currentStepIndex = action.payload;
    },
    setErrorActions: (state, action: PayloadAction<ActionTO[]>) => {
      state.errorActions = action.payload;
    },
    setActions: (state, action: PayloadAction<ActionTO[]>) => {
      state.actions = action.payload;
    },
    setComponentDatas: (state, action: PayloadAction<ComponentData[]>) => {
      state.componentDatas = action.payload;
    },
  },
});

// =============================================== THUNKS ===============================================
const calculateSequence = (
  sequence: SequenceCTO | null,
  dataSetup: DataSetupCTO | null
): { sequence: CalcSequence; loopStartingStepFk?: number } => {
  let calcSequence: CalcSequence = { steps: [], terminal: { type: GoToTypes.ERROR } };

  if (sequence && dataSetup) {
    let componenentDatas: ComponentData[] = dataSetup.initDatas.map((initData) => {
      return { componentFk: initData.componentFk, dataFk: initData.dataFk };
    });

    const root: SequenceStepCTO | ConditionTO | undefined = getRoot(sequence);

    if (root !== undefined) {
      let stepOrCondition: SequenceStepCTO | ConditionTO | Terminal = root;

      while ((stepOrCondition as SequenceStepCTO).squenceStepTO || (stepOrCondition as ConditionTO).elseGoTo) {
        if ((stepOrCondition as SequenceStepCTO).squenceStepTO) {
          const step: SequenceStepCTO = stepOrCondition as SequenceStepCTO;
          const result: SequenceActionResult = calculateStep(step, componenentDatas);
          // componentDatas = result.componenDatas;
          // if (result.errors.length > 0) {
          //   errors = result.errors;
          // }

          // loop detection
          const loopStartingStep: CalculatedStep | undefined = calcSequence.steps.find(
            (calcStep) =>
              calcStep.stepFk === step.squenceStepTO.id &&
              calcStep.componentDatas.length === result.componenDatas.length &&
              !calcStep.componentDatas.some(
                (cp) =>
                  !result.componenDatas.some((rcp) => rcp.componentFk === cp.componentFk && rcp.dataFk === cp.dataFk)
              )
          );

          calcSequence.steps.push({
            componentDatas: result.componenDatas,
            errors: result.errors,
            stepFk: step.squenceStepTO.id,
          });

          if (loopStartingStep) {
            return { sequence: calcSequence, loopStartingStepFk: loopStartingStep.stepFk };
          }
          // set next object.
          stepOrCondition = getNext((stepOrCondition as SequenceStepCTO).squenceStepTO.goto, sequence);
        }

        if ((stepOrCondition as ConditionTO).elseGoTo) {
          const condition: ConditionTO = stepOrCondition as ConditionTO;
          const goTo: GoTo = SequenceActionReducer.executeConditionCheck(condition, componenentDatas);
          stepOrCondition = getNext(goTo, sequence);
        }
      }
      if ((stepOrCondition as Terminal).type === GoToTypes.FIN) {
        calcSequence.terminal = stepOrCondition as Terminal;
      }
    }
  }
  return { sequence: calcSequence };
};

const getNext = (goTo: GoTo, sequence: SequenceCTO): SequenceStepCTO | ConditionTO | Terminal => {
  let nextStepOrConditionOrTerminal: SequenceStepCTO | ConditionTO | Terminal = { type: GoToTypes.ERROR };
  switch (goTo.type) {
    case GoToTypes.STEP:
      nextStepOrConditionOrTerminal = getStepFromSequence(goTo.id, sequence) || { type: GoToTypes.ERROR };
      break;
    case GoToTypes.COND:
      nextStepOrConditionOrTerminal = getConditionFromSequence(goTo.id, sequence) || { type: GoToTypes.ERROR };
      break;
    case GoToTypes.FIN:
      nextStepOrConditionOrTerminal = { type: GoToTypes.FIN };
  }
  return nextStepOrConditionOrTerminal;
};

const calculateStep = (step: SequenceStepCTO, componentDatas: ComponentData[]): SequenceActionResult => {
  return SequenceActionReducer.executeActionsOnComponentDatas(step.actions, componentDatas);
};

const getRoot = (sequence: SequenceCTO): SequenceStepCTO | ConditionTO | undefined => {
  const step: SequenceStepCTO | undefined = sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.root);
  const cond: ConditionTO | undefined = sequence.conditions.find((cond) => cond.root);
  return step ? step : cond ? cond : undefined;
};

const getStepFromSequence = (stepId: number, sequence: SequenceCTO): SequenceStepCTO | undefined => {
  return sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === stepId);
};

const getConditionFromSequence = (conditionId: number, sequence: SequenceCTO): ConditionTO | undefined => {
  return sequence.conditions.find((cond) => cond.id === conditionId);
};

const getDataSetupCTOFromBackend = (dataSetupId: number): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.findDataSetupCTO(dataSetupId);
  if (response.code === 200) {
    dispatch(SequenceModelSlice.actions.setSelectedDataSetup(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const getSequenceCTOFromBackend = (sequenceId: number): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceCTO> = DataAccess.findSequenceCTO(sequenceId);
  if (response.code === 200) {
    dispatch(SequenceModelSlice.actions.setSelectedSequence(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};
// =============================================== SELECTORS ===============================================

export const SequenceModelReducer = SequenceModelSlice.reducer;
export const sequenceModelSelectors = {
  selectSequence: (state: RootState): SequenceCTO | null => state.sequenceModel.selectedSequenceModel,
  // {
  // return state.edit.mode === Mode.VIEW && (state.sequenceModel.selectedSequence as SequenceCTO).sequenceTO
  //   ? (state.sequenceModel.selectedSequence as SequenceCTO)
  //   : null;
  // },
  selectDataSetup: (state: RootState): DataSetupCTO | null => state.sequenceModel.selectedDataSetup,
  // {
  //   return state.edit.mode === Mode.VIEW && (state.sequenceModel.selectedDataSetup as DataSetupCTO).dataSetup
  //     ? (state.sequenceModel.selectedDataSetup as DataSetupCTO)
  //     : null;
  // },
  selectCurrentStepIndex: (state: RootState): number => state.sequenceModel.currentStepIndex,
  selectCurrentStep: (state: RootState): SequenceStepCTO | null =>
    state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs.find(
      (step) => step.squenceStepTO.index === state.sequenceModel.currentStepIndex
    ) || null,
  selectCurrentArrows: (state: RootState): Arrows[] => {
    const arrows: Arrows[] = [];
    const step: SequenceStepCTO | null =
      state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs.find(
        (stp) => stp.squenceStepTO.index === state.sequenceModel.currentStepIndex
      ) || null;
    if (step !== null) {
      arrows.push({
        sourceComponentId: step.squenceStepTO.sourceComponentFk,
        targetComponentId: step.squenceStepTO.targetComponentFk,
      });
    }
    return arrows;
  },
};

// =============================================== ACTIONS ===============================================

export const SequenceModelActions = {
  setCurrentSequence: getSequenceCTOFromBackend,
  setCurrentDataSetup: getDataSetupCTOFromBackend,
  resetCurrentDataSetup: SequenceModelSlice.actions.setSelectedDataSetup(null),
  resetCurrentStepIndex: SequenceModelSlice.actions.setCurrentStepIndex(-1),
  resetCurrentSequence: SequenceModelSlice.actions.setSelectedSequence(null),
  setCurrentStepIndex: SequenceModelSlice.actions.setCurrentStepIndex,
};
