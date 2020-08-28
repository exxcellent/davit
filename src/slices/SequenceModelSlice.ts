import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { Arrows as Arrow } from "../components/metaComponentModel/presentation/MetaComponentModelController";
import { ChainCTO } from "../dataAccess/access/cto/ChainCTO";
import { ChainlinkCTO } from "../dataAccess/access/cto/ChainlinkCTO";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { GeometricalDataCTO } from "../dataAccess/access/cto/GeometraicalDataCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { ChainDecisionTO } from "../dataAccess/access/to/ChainDecisionTO";
import { ChainTO } from "../dataAccess/access/to/ChainTO";
import { Terminal } from "../dataAccess/access/types/GoToType";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { CalcChain, getRoot, SequenceChainService } from "../SequenceChainService";
import { CalcSequence, CalculatedStep, SequenceService } from "../SequenceService";
import { ComponentData } from "../viewDataTypes/ComponentData";
import { Mode } from "./EditSlice";
import { handleError } from "./GlobalSlice";

export interface Filter {
  type: "COMPONENT" | "DATA";
  id: number;
}

interface SequenceModelState {
  selectedSequenceModel: SequenceCTO | null;
  selectedDataSetup: DataSetupCTO | null;
  calcSequence: CalcSequence | null;
  calcChain: CalcChain | null;
  currentStepIndex: number;
  currentLinkIndex: number;
  errorActions: ActionTO[];
  actions: ActionTO[];
  componentDatas: ComponentData[];
  activeFilter: Filter[];
  selectedChain: ChainCTO | null;
}
const getInitialState: SequenceModelState = {
  selectedSequenceModel: null,
  selectedDataSetup: null,
  calcSequence: null,
  calcChain: null,
  currentStepIndex: 0,
  currentLinkIndex: 0,
  errorActions: [],
  actions: [],
  componentDatas: [],
  activeFilter: [],
  selectedChain: null,
};

const SequenceModelSlice = createSlice({
  name: "sequenceModel",
  initialState: getInitialState,
  reducers: {
    setSelectedSequence: (state, action: PayloadAction<SequenceCTO | null>) => {
      state.selectedSequenceModel = action.payload;
      // TODO: in extra method und nur ausführen wenn sequence und datasetup gestezt sind sonst reset.
      state.selectedChain = null;
      state.calcChain = null;
      state.currentLinkIndex = 0;
      state.currentStepIndex = 0;
      if (action.payload && state.selectedDataSetup) {
        calcSequenceAndSetState(action.payload, state.selectedDataSetup, state);
      } else {
        resetState(state);
      }
    },
    recalcSequence: (state) => {
      if (state.selectedSequenceModel && state.selectedDataSetup) {
        calcSequenceAndSetState(state.selectedSequenceModel, state.selectedDataSetup, state);
      }
    },
    setCurrentLinkIndex: (state, action: PayloadAction<number>) => {
      state.currentStepIndex = 0;
      //on decrement we first set the step index to 0 and only if it is 0 we decrement the link index
      if (state.calcChain && state.calcChain.calcLinks.length > action.payload && action.payload >= 0) {
        state.currentLinkIndex = action.payload;
      } else if (state.calcChain && action.payload < 0) {
        state.currentLinkIndex = state.calcChain.calcLinks.length - 1;
      } else {
        state.currentLinkIndex = 0;
      }
    },
    setSelectedChain: (state, action: PayloadAction<ChainCTO | null>) => {
      state.selectedChain = action.payload;
      resetState(state);
      state.selectedSequenceModel = null;
      state.selectedDataSetup = null;
      state.currentLinkIndex = 0;
      state.currentStepIndex = 0;
    },
    setCalcChain: (state, action: PayloadAction<CalcChain | null>) => {
      state.calcChain = action.payload;
    },
    setSelectedDataSetup: (state, action: PayloadAction<DataSetupCTO | null>) => {
      state.selectedDataSetup = action.payload;
      // TODO: in extra method und nur ausführen wenn sequence und datasetup gestezt sind sonst reset.
      state.selectedChain = null;
      state.calcChain = null;
      state.currentLinkIndex = 0;
      if (action.payload && state.selectedSequenceModel) {
        calcSequenceAndSetState(state.selectedSequenceModel, action.payload, state);
      } else {
        resetState(state);
      }
    },
    addDataFilter: (state, action: PayloadAction<number>) => {
      state.activeFilter = [...state.activeFilter, { type: "DATA", id: action.payload }];
      state.currentStepIndex = 0;
    },
    removeDataFilter: (state, action: PayloadAction<number>) => {
      state.activeFilter = state.activeFilter.filter((filt) => !(filt.type === "DATA" && filt.id === action.payload));
      state.currentStepIndex = 0;
    },
    addComponentFilters: (state, action: PayloadAction<number>) => {
      state.activeFilter = [...state.activeFilter, { type: "COMPONENT", id: action.payload }];
      state.currentStepIndex = 0;
    },
    removeComponentFilter: (state, action: PayloadAction<number>) => {
      state.activeFilter = state.activeFilter.filter(
        (filt) => !(filt.type === "COMPONENT" && filt.id === action.payload)
      );
      state.currentStepIndex = 0;
    },
    setCurrentStepIndex: (state, action: PayloadAction<number>) => {
      let filteredSteps: CalculatedStep[] = [];
      if (getCurrentCalcSequence(state)) {
        filteredSteps = filterSteps(
          getCurrentCalcSequence(state)?.steps || [],
          state.activeFilter,
          getCurrentSequenceModel(state)?.sequenceStepCTOs || []
        );
      }
      const newStepIndex = action.payload;
      if (getCurrentCalcSequence(state) && newStepIndex >= 0 && newStepIndex < filteredSteps.length) {
        state.currentStepIndex = action.payload;
      } else if (state.calcChain && newStepIndex === filteredSteps.length) {
        if (state.currentLinkIndex < state.calcChain.calcLinks.length - 1) {
          state.currentLinkIndex = state.currentLinkIndex + 1;
          state.currentStepIndex = 0;
        } else {
          state.currentLinkIndex = 0;
          state.currentStepIndex = 0;
        }
      } else if (state.calcChain && newStepIndex === -1) {
        const newLinkIndex =
          state.currentLinkIndex > 0 ? state.currentLinkIndex - 1 : state.calcChain.calcLinks.length - 1;
        const newfilteredSteps = filterSteps(
          state.calcChain.calcLinks[newLinkIndex].sequence.steps || [],
          state.activeFilter,
          state.calcChain.calcLinks[newLinkIndex].sequence.sequenceModel?.sequenceStepCTOs || []
        );
        state.currentStepIndex = newfilteredSteps.length - 1;
        state.currentLinkIndex = newLinkIndex;
      } else {
        state.currentStepIndex = 0;
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
  const result: CalcSequence = SequenceService.calculateSequence(sequenceModel, getComponentDatas(dataSetup));
  state.currentStepIndex = 0;
  state.errorActions = result.steps[state.currentStepIndex]?.errors || [];
  state.componentDatas = result.steps[state.currentStepIndex]?.componentDatas || [];
  state.calcSequence = result;
}

function resetState(state: SequenceModelState) {
  state.errorActions = [];
  state.componentDatas = [];
  state.calcSequence = null;
  state.activeFilter = [];
}

// =============================================== THUNKS ===============================================

export const getComponentDatas = (dataSetup: DataSetupCTO): ComponentData[] => {
  return dataSetup.initDatas.map((initData) => {
    return { componentFk: initData.componentFk, dataFk: initData.dataFk };
  });
};

const calcModelsThunk = (): AppThunk => (dispatch, getState) => {
  if (
    getState().edit.mode === Mode.VIEW &&
    getState().sequenceModel.selectedChain !== null &&
    getRoot(getState().sequenceModel.selectedChain || null)
  ) {
    dispatch(SequenceModelActions.setCurrentChain(getState().sequenceModel.selectedChain!.chain));
    dispatch(
      SequenceModelSlice.actions.setCalcChain(
        SequenceChainService.calculateChain(getState().sequenceModel.selectedChain)
      )
    );
  } else if (
    getState().edit.mode === Mode.VIEW &&
    getState().sequenceModel.selectedSequenceModel !== null &&
    getState().sequenceModel.selectedDataSetup !== null
  ) {
    dispatch(SequenceModelActions.setCurrentSequence(getState().sequenceModel.selectedSequenceModel!.sequenceTO.id));
    dispatch(SequenceModelActions.setCurrentDataSetup(getState().sequenceModel.selectedDataSetup!.dataSetup.id));
  }
};

const stepNext = (currentIndex: number): AppThunk => (dispatch) => {
  dispatch(SequenceModelActions.setCurrentStepIndex(currentIndex + 1));
};

const stepBack = (currentIndex: number): AppThunk => (dispatch) => {
  dispatch(SequenceModelActions.setCurrentStepIndex(currentIndex - 1));
};

const linkNext = (currentIndex: number): AppThunk => (dispatch) => {
  dispatch(SequenceModelActions.setCurrentLinkIndex(currentIndex + 1));
};

const linkBack = (currentIndex: number): AppThunk => (dispatch, getState) => {
  const stepIndex: number = getState().sequenceModel.currentStepIndex;
  if (stepIndex > 0) {
    dispatch(SequenceModelSlice.actions.setCurrentStepIndex(0));
  } else {
    dispatch(SequenceModelActions.setCurrentLinkIndex(currentIndex - 1));
  }
};

const setSelectedChainThunk = (chain: ChainTO): AppThunk => (dispatch, getState) => {
  const mode: Mode = getState().edit.mode;
  const response: DataAccessResponse<ChainCTO> = DataAccess.getChainCTO(chain);
  if (response.code !== 200) {
    console.warn(response.message);
  } else {
    const chainCTO: ChainCTO = response.object;
    dispatch(SequenceModelSlice.actions.setSelectedChain(chainCTO));
    if (chainCTO && mode === Mode.VIEW && getRoot(chainCTO)) {
      dispatch(SequenceModelSlice.actions.setCalcChain(SequenceChainService.calculateChain(chainCTO)));
    }
  }
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
  activeFilters: (state: RootState): Filter[] => state.sequenceModel.activeFilter,
  selectSequence: (state: RootState): SequenceCTO | null => getCurrentSequenceModel(state.sequenceModel),
  selectChain: (state: RootState): ChainTO | null => state.sequenceModel.selectedChain?.chain || null,
  selectChainCTO: (state: RootState): ChainCTO | null => state.sequenceModel.selectedChain || null,
  selectCurrentChainLinks: (state: RootState): ChainlinkCTO[] => state.sequenceModel.selectedChain?.links || [],
  selectCurrentChainDecisions: (state: RootState): ChainDecisionTO[] =>
    state.sequenceModel.selectedChain?.decisions || [],
  selectCalcChain: (state: RootState): CalcChain | null => state.sequenceModel.calcChain || null,
  selectCalcSteps: (state: RootState): CalculatedStep[] => {
    if (state.edit.mode === Mode.VIEW) {
      const currentSequence: SequenceCTO | null = getCurrentSequenceModel(state.sequenceModel);
      const calcSequence: CalcSequence | null = getCurrentCalcSequence(state.sequenceModel);
      return filterSteps(
        calcSequence?.steps || [],
        state.sequenceModel.activeFilter,
        currentSequence?.sequenceStepCTOs || []
      );
    } else {
      return [];
    }
  },
  selectCalcStepIds: (state: RootState): string[] =>
    state.edit.mode === Mode.VIEW ? getCurrentCalcSequence(state.sequenceModel)?.stepIds || [] : [],
  selectTerminalStep: (state: RootState): Terminal | null =>
    state.edit.mode === Mode.VIEW ? getCurrentCalcSequence(state.sequenceModel)?.terminal || null : null,
  selectDataSetup: (state: RootState): DataSetupCTO | null => {
    if (state.edit.mode === Mode.VIEW) {
      return getCurrentDataSetup(state.sequenceModel);
    } else {
      return null;
    }
  },
  selectComponentData: (state: RootState): ComponentData[] => {
    const filteredSteps = getFilteredSteps(state);
    return filteredSteps[state.sequenceModel.currentStepIndex]?.componentDatas || [];
  },
  selectErrors: (state: RootState): ActionTO[] => {
    const filteredSteps = getFilteredSteps(state);
    return filteredSteps[state.sequenceModel.currentStepIndex]?.errors || [];
  },
  selectActions: (state: RootState): ActionTO[] => {
    const filteredSteps = getFilteredSteps(state);
    const stepId: number | undefined = filteredSteps[state.sequenceModel.currentStepIndex]?.stepFk;
    return stepId
      ? getCurrentSequenceModel(state.sequenceModel)?.sequenceStepCTOs.find((step) => step.squenceStepTO.id === stepId)
          ?.actions || []
      : [];
  },
  selectCurrentStepIndex: (state: RootState): number => state.sequenceModel.currentStepIndex,
  selectCurrentStepId: (state: RootState): string => {
    // console.info("steps: ", getCurrentCalcSequence(state.sequenceModel)?.steps);
    return getCurrentCalcSequence(state.sequenceModel)?.steps[state.sequenceModel.currentStepIndex]?.stepId || "";
  },
  selectCurrentLinkIndex: (state: RootState): number => state.sequenceModel.currentLinkIndex,
  selectCurrentLinkId: (state: RootState): string =>
    state.sequenceModel.calcChain?.calcLinks[state.sequenceModel.currentLinkIndex]?.stepId || "",
  selectCurrentArrows: (state: RootState): Arrow[] => {
    const arrows: Arrow[] = [];
    const filteredSteps = getFilteredSteps(state);
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
      getArrowForStepFk(stepFk, getCurrentSequenceModel(state.sequenceModel)?.sequenceStepCTOs || [], state)
    );
    allArrows.forEach((arrow) => {
      if (arrow) arrows.push(arrow);
    });
    return arrows;
  },
  selectLoopStepStartIndex: (state: RootState): number | null =>
    getCurrentCalcSequence(state.sequenceModel)?.loopStartingStepIndex || null,
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
  resetCurrentChain: SequenceModelSlice.actions.setSelectedChain(null),
  setCurrentStepIndex: SequenceModelSlice.actions.setCurrentStepIndex,
  setCurrentLinkIndex: SequenceModelSlice.actions.setCurrentLinkIndex,
  handleComponentClickEvent,
  handleDataClickEvent,
  stepNext,
  stepBack,
  linkBack,
  linkNext,
  setCurrentChain: setSelectedChainThunk,
  addDataFilters: SequenceModelSlice.actions.addDataFilter,
  removeDataFilters: SequenceModelSlice.actions.removeDataFilter,
  addComponentFilters: SequenceModelSlice.actions.addComponentFilters,
  removeComponentFilter: SequenceModelSlice.actions.removeComponentFilter,
  calcChain: calcModelsThunk,
};
function getFilteredSteps(state: RootState) {
  return state.edit.mode === Mode.VIEW
    ? filterSteps(
        getCurrentCalcSequence(state.sequenceModel)?.steps || [],
        state.sequenceModel.activeFilter,
        getCurrentSequenceModel(state.sequenceModel)?.sequenceStepCTOs || []
      )
    : [];
}

function getCurrentCalcSequence(state: SequenceModelState): CalcSequence | null {
  return state.selectedChain ? state.calcChain?.calcLinks[state.currentLinkIndex].sequence || null : state.calcSequence;
}

function getCurrentSequenceModel(state: SequenceModelState): SequenceCTO | null {
  return state.selectedChain
    ? state.calcChain?.calcLinks[state.currentLinkIndex].sequence.sequenceModel || null
    : state.selectedSequenceModel;
}
function getCurrentDataSetup(state: SequenceModelState): DataSetupCTO | null {
  return state.selectedChain
    ? state.calcChain?.calcLinks[state.currentLinkIndex].dataSetup || null
    : state.selectedDataSetup;
}
