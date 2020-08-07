import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { Arrows as Arrow } from "../components/metaComponentModel/presentation/MetaComponentModelController";
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
import { Mode } from "./EditSlice";
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

export interface Filter {
  type: "COMPONENT" | "DATA";
  id: number;
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
  activeFilter: Filter[];
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
  activeFilter: [],
};

const SequenceModelSlice = createSlice({
  name: "sequenceModel",
  initialState: getInitialState,
  reducers: {
    setSelectedSequence: (state, action: PayloadAction<SequenceCTO | null>) => {
      state.selectedSequenceModel = action.payload;
      // TODO: in extra method und nur ausführen wenn sequence und datasetup gestezt sind sonst reset.
      if (action.payload && state.selectedDataSetup) {
        calcSequenceAndSetState(action.payload, state.selectedDataSetup, state);
      } else {
        resetState(state);
      }
    },
    setSelectedDataSetup: (state, action: PayloadAction<DataSetupCTO | null>) => {
      state.selectedDataSetup = action.payload;
      // TODO: in extra method und nur ausführen wenn sequence und datasetup gestezt sind sonst reset.
      if (action.payload && state.selectedSequenceModel) {
        calcSequenceAndSetState(state.selectedSequenceModel, action.payload, state);
      } else {
        resetState(state);
      }
    },
    setCurrentStepIndex: (state, action: PayloadAction<number>) => {
      let filteredSteps: CalculatedStep[] = [];
      if (state.calcSequence) {
        filteredSteps = filterSteps(
          state.calcSequence.steps,
          state.activeFilter,
          state.selectedSequenceModel?.sequenceStepCTOs || []
        );
      }
      const newStepIndex = action.payload;
      if (state.calcSequence && newStepIndex >= 0 && newStepIndex < filteredSteps.length) {
        state.currentStepIndex = action.payload;
      }
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
    setFilter: (state, action: PayloadAction<Filter[]>) => {
      state.activeFilter = action.payload;
      state.currentStepIndex = 0;
    },
  },
});

function calcSequenceAndSetState(sequenceModel: SequenceCTO, dataSetup: DataSetupCTO, state: SequenceModelState) {
  const result: { sequence: CalcSequence; loopStartingStepIndex?: number } = calculateSequence(
    sequenceModel,
    dataSetup
  );
  state.currentStepIndex = 0;
  state.errorActions = result.sequence.steps[state.currentStepIndex]?.errors || [];
  state.componentDatas = result.sequence.steps[state.currentStepIndex]?.componentDatas || [];
  state.calcSequence = result.sequence;
  state.loopStartingStepIndex = result.loopStartingStepIndex || null;
}

function resetState(state: SequenceModelState) {
  state.errorActions = [];
  state.componentDatas = [];
  state.calcSequence = null;
  state.loopStartingStepIndex = null;
  state.activeFilter = [];
}

// =============================================== THUNKS ===============================================
const calculateSequence = (
  sequence: SequenceCTO | null,
  dataSetup: DataSetupCTO | null
): { sequence: CalcSequence; loopStartingStepIndex?: number } => {
  let calcSequence: CalcSequence = { steps: [], terminal: { type: GoToTypes.ERROR } };

  if (sequence && dataSetup) {
    let componenentDatas: ComponentData[] = dataSetup.initDatas.map((initData) => {
      return { componentFk: initData.componentFk, dataFk: initData.dataFk };
    });
    calcSequence.steps.push({ componentDatas: componenentDatas, stepFk: 0, errors: [] });

    const root: SequenceStepCTO | ConditionTO | undefined = getRoot(sequence);

    if (root !== undefined) {
      let stepOrCondition: SequenceStepCTO | ConditionTO | Terminal = root;

      while ((stepOrCondition as SequenceStepCTO).squenceStepTO || (stepOrCondition as ConditionTO).elseGoTo) {
        if ((stepOrCondition as SequenceStepCTO).squenceStepTO) {
          const step: SequenceStepCTO = stepOrCondition as SequenceStepCTO;
          const result: SequenceActionResult = calculateStep(step, componenentDatas);

          // loop detection
          const loopStartingStep: number = calcSequence.steps.findIndex(
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

          if (loopStartingStep > -1) {
            return { sequence: calcSequence, loopStartingStepIndex: loopStartingStep };
          }
          // set next object.
          stepOrCondition = getNext((stepOrCondition as SequenceStepCTO).squenceStepTO.goto, sequence);
          componenentDatas = result.componenDatas;
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

const handleComponentClickEvent = (componentId: number): AppThunk => (dispatch) => {
  const filter: Filter[] = [];
  filter.push({ type: "COMPONENT", id: componentId });
  dispatch(SequenceModelSlice.actions.setFilter(filter));
};

const handleDataClickEvent = (dataId: number): AppThunk => (dispatch) => {
  const filter: Filter[] = [];
  filter.push({ type: "DATA", id: dataId });
  dispatch(SequenceModelSlice.actions.setFilter(filter));
};

const filterSteps = (steps: CalculatedStep[], filter: Filter[], modelSteps: SequenceStepCTO[]): CalculatedStep[] => {
  if (filter.length === 0) {
    return steps;
  }
  return steps.filter((step) =>
    filter.some((currentFilter) => {
      const actions: ActionTO[] =
        modelSteps.find((modelStep) => modelStep.squenceStepTO.id === step.stepFk)?.actions || [];
      switch (currentFilter.type) {
        case "COMPONENT":
          return actions.some((action) => action.componentFk === currentFilter.id);
        case "DATA":
          return actions.some((action) => action.dataFk === currentFilter.id);
        default:
          return false;
      }
    })
  );
};

const getArrowForStepFk = (stepFk: number, sequenceStepCTOs: SequenceStepCTO[]): Arrow | undefined => {
  let step: SequenceStepCTO | undefined;
  if (stepFk && sequenceStepCTOs) {
    step = sequenceStepCTOs.find((stp) => stp.squenceStepTO.id === stepFk);
  }
  if (step) {
    return mapStepToArrow(step);
  }
};
// =============================================== SELECTORS ===============================================

export const SequenceModelReducer = SequenceModelSlice.reducer;
export const sequenceModelSelectors = {
  selectSequence: (state: RootState): SequenceCTO | null => state.sequenceModel.selectedSequenceModel,
  selectCalcSteps: (state: RootState): CalculatedStep[] =>
    state.edit.mode === Mode.VIEW
      ? filterSteps(
          state.sequenceModel.calcSequence?.steps || [],
          state.sequenceModel.activeFilter,
          state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs || []
        )
      : [],
  selectTerminalStep: (state: RootState): Terminal | null =>
    state.edit.mode === Mode.VIEW ? state.sequenceModel.calcSequence?.terminal || null : null,
  selectDataSetup: (state: RootState): DataSetupCTO | null => state.sequenceModel.selectedDataSetup,

  selectComponentData: (state: RootState): ComponentData[] => {
    const filteredSteps =
      state.edit.mode === Mode.VIEW
        ? filterSteps(
            state.sequenceModel.calcSequence?.steps || [],
            state.sequenceModel.activeFilter,
            state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs || []
          )
        : [];
    return filteredSteps[state.sequenceModel.currentStepIndex]?.componentDatas || [];
  },
  selectErrors: (state: RootState): ActionTO[] => {
    const filteredSteps =
      state.edit.mode === Mode.VIEW
        ? filterSteps(
            state.sequenceModel.calcSequence?.steps || [],
            state.sequenceModel.activeFilter,
            state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs || []
          )
        : [];
    return filteredSteps[state.sequenceModel.currentStepIndex]?.errors || [];
  },
  selectActions: (state: RootState): ActionTO[] => {
    const filteredSteps =
      state.edit.mode === Mode.VIEW
        ? filterSteps(
            state.sequenceModel.calcSequence?.steps || [],
            state.sequenceModel.activeFilter,
            state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs || []
          )
        : [];
    const stepId: number | undefined = filteredSteps[state.sequenceModel.currentStepIndex]?.stepFk;
    return stepId
      ? state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs.find((step) => step.squenceStepTO.id === stepId)
          ?.actions || []
      : [];
  },
  selectCurrentStepIndex: (state: RootState): number => state.sequenceModel.currentStepIndex,
  selectCurrentArrows: (state: RootState): Arrow[] => {
    const arrows: Arrow[] = [];
    const filteredSteps =
      state.edit.mode === Mode.VIEW
        ? filterSteps(
            state.sequenceModel.calcSequence?.steps || [],
            state.sequenceModel.activeFilter,
            state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs || []
          )
        : [];
    let stepFks: number[] = [];
    if (arrows.length === -1000) {
      /* TODO: reactivate state.sequenceModel.currentStepIndex === 0)*/ stepFks = filteredSteps.map(
        (step) => step.stepFk
      );
    } else {
      const stepFk: number | undefined = filteredSteps[state.sequenceModel.currentStepIndex]?.stepFk;
      if (stepFk) {
        stepFks.push(stepFk);
      }
    }
    const allArrows: (Arrow | undefined)[] = stepFks.map((stepFk) =>
      getArrowForStepFk(stepFk, state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs || [])
    );
    allArrows.forEach((arrow) => {
      if (arrow) arrows.push(arrow);
    });
    return arrows;
  },
  selectLoopStepStartIndex: (state: RootState): number | null => state.sequenceModel.loopStartingStepIndex,
};

const mapStepToArrow = (step: SequenceStepCTO) => {
  return {
    sourceComponentId: step.squenceStepTO.sourceComponentFk,
    targetComponentId: step.squenceStepTO.targetComponentFk,
  };
};

// =============================================== ACTIONS ===============================================

export const SequenceModelActions = {
  setCurrentSequence: getSequenceCTOFromBackend,
  setCurrentDataSetup: getDataSetupCTOFromBackend,
  resetCurrentDataSetup: SequenceModelSlice.actions.setSelectedDataSetup(null),
  resetCurrentStepIndex: SequenceModelSlice.actions.setCurrentStepIndex(-1),
  resetCurrentSequence: SequenceModelSlice.actions.setSelectedSequence(null),
  setCurrentStepIndex: SequenceModelSlice.actions.setCurrentStepIndex,
  handleComponentClickEvent,
  handleDataClickEvent,
};