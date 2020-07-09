import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { Arrows } from "../components/metaComponentModel/presentation/MetaComponentModelController";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { SequenceActionReducer, SequenceActionResult } from "../reducer/SequenceActionReducer";
import { ComponentData } from "../viewDataTypes/ComponentData";
import { handleError } from "./GlobalSlice";

interface SequenceModelState {
  selectedSequence: SequenceCTO | null;
  selectedDataSetup: DataSetupCTO | null;
  currentStepIndex: number;
  errorActions: ActionTO[];
  actions: ActionTO[];
  componentDatas: ComponentData[];
}
const getInitialState: SequenceModelState = {
  selectedSequence: null,
  selectedDataSetup: null,
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
      state.selectedSequence = action.payload;
      // const result: {
      //   componentDatas: Map<number, ComponentData[]>;
      //   errors: Map<number, ActionTO[]>;
      // } = calculateSequence(action.payload, state.selectedDataSetup);
      // state.errorMap = result.errors;
    },
    setSelectedDataSetup: (state, action: PayloadAction<DataSetupCTO | null>) => {
      state.selectedDataSetup = action.payload;
      // const result: {
      //   componentDatas: Map<number, ComponentData[]>;
      //   errors: Map<number, ActionTO[]>;
      // } = calculateSequence(state.selectedSequence, action.payload);
      // state.errorMap = result.errors;
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
): { stepFk: number; componentDatas: ComponentData[]; errors: ActionTO[] } => {
  let componentDatas: ComponentData[] = [];
  let errors: ActionTO[] = [];
  let index = 1;
  if (sequence && dataSetup) {
    let componenentDatas: ComponentData[] = dataSetup.initDatas.map((initData) => {
      return { componentFk: initData.componentFk, dataFk: initData.dataFk };
    });
    let step = getStepFromSequence(index, sequence);
    // while (step) {
    //   const result: SequenceActionResult = calculateStep(step, componenentDatas);
    //   componentDatas.set(step.squenceStepTO.index, result.componenDatas);
    //   if (result.errors.length > 0) {
    //     errors.set(step.squenceStepTO.index, result.errors);
    //   }
    //   componenentDatas = result.componenDatas;
    //   index++;
    //   step = getStepFromSequence(index, sequence);
    // }
  }
  return { stepFk: index, componentDatas: componentDatas, errors: errors };
};

const calculateStep = (step: SequenceStepCTO, componentDatas: ComponentData[]): SequenceActionResult => {
  return SequenceActionReducer.executeActionsOnComponentDatas(step.actions, componentDatas);
};

const getStepFromSequence = (stepIndex: number, sequence: SequenceCTO): SequenceStepCTO | undefined => {
  return sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.index === stepIndex);
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
  selectSequence: (state: RootState): SequenceCTO | null => state.sequenceModel.selectedSequence,
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
    state.sequenceModel.selectedSequence?.sequenceStepCTOs.find(
      (step) => step.squenceStepTO.index === state.sequenceModel.currentStepIndex
    ) || null,
  selectCurrentArrows: (state: RootState): Arrows[] => {
    const arrows: Arrows[] = [];
    const step: SequenceStepCTO | null =
      state.sequenceModel.selectedSequence?.sequenceStepCTOs.find(
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
