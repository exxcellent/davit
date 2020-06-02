import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { handleError } from "./GlobalSlice";

interface SequenceState {
  currentSequence: SequenceCTO | null;
  currentStepIndex: number | null;
  sequences: SequenceCTO[];
}
const getInitialState: SequenceState = {
  currentSequence: null,
  currentStepIndex: null,
  sequences: [],
};

export const SequenceSlice = createSlice({
  name: "sequence",
  initialState: getInitialState,
  reducers: {
    setCurrentSequence: (state, action: PayloadAction<SequenceCTO | null>) => {
      if (action.payload !== null) {
        action.payload.sequenceStepCTOs.sort((step1, step2) => step1.squenceStepTO.index - step2.squenceStepTO.index);
      }
      state.currentSequence = action.payload;
    },
    setCurrentStepIndex: (state, action: PayloadAction<number | null>) => {
      state.currentStepIndex = action.payload;
      // state.currentSequence?.sequenceStepCTOs.find((step) => step.squenceStepTO.index === action.payload) || null;
    },
    resetCurrentSequence: (state) => {
      state.currentSequence = null;
    },
    resetCurrentStepIndex: (state) => {
      state.currentStepIndex = null;
    },
    setSequences: (state, action: PayloadAction<SequenceCTO[]>) => {
      state.sequences = action.payload;
    },
  },
});

export const SequenceReducer = SequenceSlice.reducer;
export const selectSequences = (state: RootState): SequenceCTO[] => state.sequenceModel.sequences;
export const currentSequence = (state: RootState): SequenceCTO | null => state.sequenceModel.currentSequence;
const currentStepIndex = (state: RootState): number | null => state.sequenceModel.currentStepIndex;
export const currentStep = (state: RootState): SequenceStepCTO | null => {
  return (
    currentSequence(state)?.sequenceStepCTOs.find((step) => step.squenceStepTO.index === currentStepIndex(state)) ||
    null
  );
};

const loadSequencesFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceCTO[]> = await DataAccess.findAllSequences();
  if (response.code === 200) {
    dispatch(SequenceSlice.actions.setSequences(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const saveSequenceThunk = (sequence: SequenceCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceCTO> = await DataAccess.saveSequenceCTO(sequence);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadSequencesFromBackend());
};

const deleteSequenceThunk = (sequence: SequenceCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceCTO> = await DataAccess.deleteSequenceCTO(sequence);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadSequencesFromBackend());
};

export const SequenceActions = {
  setSequenceToEdit: SequenceSlice.actions.setCurrentSequence,
  setSequenceStepToEdit: SequenceSlice.actions.setCurrentStepIndex,
  loadSequencesFromBackend,
  saveSequence: saveSequenceThunk,
  deleteSequence: deleteSequenceThunk,
};
