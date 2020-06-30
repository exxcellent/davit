import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { SequenceActionReducer, SequenceActionResult } from "../reducer/SequenceActionReducer";
import { ComponentData } from "../viewDataTypes/ComponentData";
import { Mode } from "./EditSlice";
import { handleError } from "./GlobalSlice";

interface SequenceModelState {
  selectedSequence: SequenceCTO | null;
  selectedDataSetup: DataSetupCTO | null;
  currentStepIndex: number;
  componentDataMap: Map<number, ComponentData[]>;
  errorMap: Map<number, ActionTO[]>;
}
const getInitialState: SequenceModelState = {
  selectedSequence: null,
  selectedDataSetup: null,
  currentStepIndex: -1,
  componentDataMap: new Map(),
  errorMap: new Map(),
};

const SequenceModelSlice = createSlice({
  name: "sequenceModel",
  initialState: getInitialState,
  reducers: {
    setSelectedSequence: (state, action: PayloadAction<SequenceCTO | null>) => {
      state.selectedSequence = action.payload;
      const result: {
        componentDatas: Map<number, ComponentData[]>;
        errors: Map<number, ActionTO[]>;
      } = calculateSequence(action.payload, state.selectedDataSetup);
      state.componentDataMap = result.componentDatas;
      state.errorMap = result.errors;
    },
    setSelectedDataSetup: (state, action: PayloadAction<DataSetupCTO | null>) => {
      state.selectedDataSetup = action.payload;
      const result: {
        componentDatas: Map<number, ComponentData[]>;
        errors: Map<number, ActionTO[]>;
      } = calculateSequence(state.selectedSequence, action.payload);
      state.componentDataMap = result.componentDatas;
      state.errorMap = result.errors;
    },
    setCurrentStepIndex: (state, action: PayloadAction<number>) => {
      state.currentStepIndex = action.payload;
    },
  },
});

// =============================================== THUNKS ===============================================
const calculateSequence = (
  sequence: SequenceCTO | null,
  dataSetup: DataSetupCTO | null
): { componentDatas: Map<number, ComponentData[]>; errors: Map<number, ActionTO[]> } => {
  let componentDataMap = new Map();
  let errorMap = new Map<number, ActionTO[]>();
  let index = 1;
  if (sequence && dataSetup) {
    let componenentDatas: ComponentData[] = dataSetup.initDatas.map((initData) => {
      return { componentFk: initData.componentFk, dataFk: initData.dataFk };
    });
    let step = getStep(index, sequence);
    while (step) {
      const result: SequenceActionResult = calculateStep(step, componenentDatas);
      componentDataMap.set(step.squenceStepTO.index, result.componenDatas);
      if (result.errors.length > 0) {
        errorMap.set(step.squenceStepTO.index, result.errors);
      }
      componenentDatas = result.componenDatas;
      index++;
      step = getStep(index, sequence);
    }
  }
  return { componentDatas: componentDataMap, errors: errorMap };
};

const calculateStep = (step: SequenceStepCTO, componentDatas: ComponentData[]): SequenceActionResult => {
  return SequenceActionReducer.executeActionsOnComponentDatas(step.actions, componentDatas);
};

const getStep = (stepIndex: number, sequence: SequenceCTO): SequenceStepCTO | undefined => {
  return sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.index === stepIndex);
};

const getDataSetupCTO = (dataSetupId: number): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.findDataSetupCTO(dataSetupId);
  if (response.code === 200) {
    dispatch(SequenceModelSlice.actions.setSelectedDataSetup(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const getSequenceCTO = (sequenceId: number): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceCTO> = DataAccess.findSequence(sequenceId);
  if (response.code === 200) {
    dispatch(SequenceModelSlice.actions.setSelectedSequence(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};
// =============================================== SELECTORS ===============================================

export const SequenceModelReducer = SequenceModelSlice.reducer;
export const sequenceModelSelectors = {
  selectSequence: (state: RootState): SequenceCTO | null => {
    return state.edit.mode === Mode.VIEW && (state.sequenceModel.selectedSequence as SequenceCTO).sequenceTO
      ? (state.sequenceModel.selectedSequence as SequenceCTO)
      : null;
  },
  selectDataSetup: (state: RootState): DataSetupCTO | null => {
    return state.edit.mode === Mode.VIEW && (state.sequenceModel.selectedDataSetup as DataSetupCTO).dataSetup
      ? (state.sequenceModel.selectedDataSetup as DataSetupCTO)
      : null;
  },
  selectCurrentStepIndex: (state: RootState): number => state.sequenceModel.currentStepIndex,
  selectCurrentStep: (state: RootState): SequenceStepCTO | null =>
    state.sequenceModel.selectedSequence?.sequenceStepCTOs.find(
      (step) => step.squenceStepTO.index === state.sequenceModel.currentStepIndex
    ) || null,
};

// =============================================== ACTIONS ===============================================

export const SequenceModelActions = {
  setCurrentSequence: getSequenceCTO,
  setCurrentDataSetup: getDataSetupCTO,
  resetCurrentDataSetup: SequenceModelSlice.actions.setSelectedDataSetup(null),
  resetCurrentStepIndex: SequenceModelSlice.actions.setCurrentStepIndex(-1),
  resetCurrentSequence: SequenceModelSlice.actions.setSelectedSequence(null),
  setCurrentStepIndex: SequenceModelSlice.actions.setCurrentStepIndex,
};
