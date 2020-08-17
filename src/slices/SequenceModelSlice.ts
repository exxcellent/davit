import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { Arrows as Arrow } from "../components/metaComponentModel/presentation/MetaComponentModelController";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { GeometricalDataCTO } from "../dataAccess/access/cto/GeometraicalDataCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { ChainTO } from "../dataAccess/access/to/ChainTO";
import { DecisionTO } from "../dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes, Terminal } from "../dataAccess/access/types/GoToType";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { SequenceActionReducer, SequenceActionResult } from "../reducer/SequenceActionReducer";
import { ComponentData } from "../viewDataTypes/ComponentData";
import { Mode } from "./EditSlice";
import { handleError } from "./GlobalSlice";

export interface CalculatedStep {
  stepFk: number;
  stepId: string;
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
  stepIds: string[];
  selectedChain: ChainTO | null;
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
  stepIds: [],
  selectedChain: null,
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
    setSelectedChain: (state, action: PayloadAction<ChainTO | null>) => {
      state.selectedChain = action.payload;
    },
    setStepIds: (state, action: PayloadAction<string[] | null>) => {
      if (action.payload !== null) {
        state.stepIds = action.payload;
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
  const result: { sequence: CalcSequence; loopStartingStepIndex?: number; stepIds: string[] } = calculateSequence(
    sequenceModel,
    dataSetup
  );
  state.stepIds = result.stepIds;
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
  state.stepIds = [];
}

// =============================================== THUNKS ===============================================

const stepNext = (currentIndex: number): AppThunk => (dispatch) => {
  dispatch(SequenceModelActions.setCurrentStepIndex(currentIndex + 1));
};

const stepBack = (currentIndex: number): AppThunk => (dispatch) => {
  dispatch(SequenceModelActions.setCurrentStepIndex(currentIndex - 1));
};

const calculateSequence = (
  sequence: SequenceCTO | null,
  dataSetup: DataSetupCTO | null
): { sequence: CalcSequence; stepIds: string[]; loopStartingStepIndex?: number } => {
  let calcSequence: CalcSequence = { steps: [], terminal: { type: GoToTypes.ERROR } };
  let stepIds: string[] = [];

  if (sequence && dataSetup) {
    let componenentDatas: ComponentData[] = dataSetup.initDatas.map((initData) => {
      return { componentFk: initData.componentFk, dataFk: initData.dataFk };
    });
    // init step.
    calcSequence.steps.push({ stepId: "", componentDatas: componenentDatas, stepFk: 0, errors: [] });

    const root: SequenceStepCTO | DecisionTO | undefined = getRoot(sequence);

    if (root !== undefined) {
      let stepOrDecision: SequenceStepCTO | DecisionTO | Terminal = root;

      let isRoot: boolean = true;
      let stepId: string = "";

      while ((stepOrDecision as SequenceStepCTO).squenceStepTO || (stepOrDecision as DecisionTO).elseGoTo) {
        if ((stepOrDecision as SequenceStepCTO).squenceStepTO) {
          const step: SequenceStepCTO = stepOrDecision as SequenceStepCTO;
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

          // STEP ID
          if (isRoot) {
            stepId = "root";
            isRoot = false;
          } else {
            stepId = stepId + "_STEP_" + step.squenceStepTO.id;
            stepIds.push(stepId);
          }

          calcSequence.steps.push({
            stepId: stepId,
            componentDatas: result.componenDatas,
            errors: result.errors,
            stepFk: step.squenceStepTO.id,
          });

          if (loopStartingStep > -1) {
            return { sequence: calcSequence, loopStartingStepIndex: loopStartingStep, stepIds: stepIds };
          }
          // set next object.
          stepOrDecision = getNext((stepOrDecision as SequenceStepCTO).squenceStepTO.goto, sequence);
          componenentDatas = result.componenDatas;
        }

        if ((stepOrDecision as DecisionTO).elseGoTo) {
          const decision: DecisionTO = stepOrDecision as DecisionTO;
          const goTo: GoTo = SequenceActionReducer.executeDecisionCheck(decision, componenentDatas);
          stepOrDecision = getNext(goTo, sequence);

          // STEP ID
          if (isRoot) {
            stepId = "root";
            isRoot = false;
          } else {
            stepId = stepId + "_COND_" + decision.id;
            stepIds.push(stepId);
          }
        }
      }
      if ((stepOrDecision as Terminal).type === GoToTypes.FIN) {
        calcSequence.terminal = stepOrDecision as Terminal;
      }
      stepIds.push(stepId + "_" + (stepOrDecision as Terminal).type);
    }
  }
  return { sequence: calcSequence, stepIds: stepIds };
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
  }
  return nextStepOrDecisionOrTerminal;
};

const calculateStep = (step: SequenceStepCTO, componentDatas: ComponentData[]): SequenceActionResult => {
  return SequenceActionReducer.executeActionsOnComponentDatas(step.actions, componentDatas);
};

const getRoot = (sequence: SequenceCTO): SequenceStepCTO | DecisionTO | undefined => {
  const step: SequenceStepCTO | undefined = sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.root);
  const cond: DecisionTO | undefined = sequence.decisions.find((cond) => cond.root);
  return step ? step : cond ? cond : undefined;
};

const getStepFromSequence = (stepId: number, sequence: SequenceCTO): SequenceStepCTO | undefined => {
  return sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === stepId);
};

const getDecisionFromSequence = (id: number, sequence: SequenceCTO): DecisionTO | undefined => {
  return sequence.decisions.find((cond) => cond.id === id);
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

const getArrowForStepFk = (
  stepFk: number,
  sequenceStepCTOs: SequenceStepCTO[],
  rootState: RootState
): Arrow | undefined => {
  let step: SequenceStepCTO | undefined;
  if (stepFk && sequenceStepCTOs) {
    step = sequenceStepCTOs.find((stp) => stp.squenceStepTO.id === stepFk);
  }
  if (step) {
    return mapStepToArrow(step, rootState);
  }
};

// =============================================== SELECTORS ===============================================

export const SequenceModelReducer = SequenceModelSlice.reducer;
export const sequenceModelSelectors = {
  selectSequence: (state: RootState): SequenceCTO | null => state.sequenceModel.selectedSequenceModel,
  selectChain: (state: RootState): ChainTO | null => state.sequenceModel.selectedChain,
  selectCalcSteps: (state: RootState): CalculatedStep[] =>
    state.edit.mode === Mode.VIEW
      ? filterSteps(
          state.sequenceModel.calcSequence?.steps || [],
          state.sequenceModel.activeFilter,
          state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs || []
        )
      : [],
  selectCalcStepIds: (state: RootState): string[] => (state.edit.mode === Mode.VIEW ? state.sequenceModel.stepIds : []),
  selectTerminalStep: (state: RootState): Terminal | null =>
    state.edit.mode === Mode.VIEW ? state.sequenceModel.calcSequence?.terminal || null : null,
  selectDataSetup: (state: RootState): DataSetupCTO | null => {
    if (state.edit.mode === Mode.VIEW) {
      return state.sequenceModel.selectedDataSetup;
    } else {
      return null;
    }
  },
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
    // this hack is because we cannot show more than arrow at the moment. This would calc all arrows if step index === 0. The length hack is because javascript doesnt accept if (false)
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
      getArrowForStepFk(stepFk, state.sequenceModel.selectedSequenceModel?.sequenceStepCTOs || [], state)
    );
    allArrows.forEach((arrow) => {
      if (arrow) arrows.push(arrow);
    });
    return arrows;
  },
  selectLoopStepStartIndex: (state: RootState): number | null => state.sequenceModel.loopStartingStepIndex,
};

const mapStepToArrow = (step: SequenceStepCTO, state: RootState): Arrow | undefined => {
  const sourceGeometricalData: GeometricalDataCTO | undefined = state.masterData.components.find(
    (comp) => comp.component.id === step.squenceStepTO.sourceComponentFk
  )?.geometricalData;
  const targetGeometricalData: GeometricalDataCTO | undefined = state.masterData.components.find(
    (comp) => comp.component.id === step.squenceStepTO.targetComponentFk
  )?.geometricalData;
  if (sourceGeometricalData && targetGeometricalData) {
    return {
      sourceGeometricalData,
      targetGeometricalData,
    };
  }
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
  stepNext,
  stepBack,
  setCurrentChain: SequenceModelSlice.actions.setSelectedChain,
};
