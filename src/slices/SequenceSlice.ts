import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { Carv2Util } from "../utils/Carv2Util";
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
      console.log("call setCurrentSequence.");
      console.log("sequence: " + action.payload);
      const copyPayload: SequenceCTO = Carv2Util.deepCopy(action.payload);
      console.info("copy payload sequence.", action.payload);
      if (action.payload !== null) {
        copyPayload.sequenceStepCTOs.sort((step1, step2) => step1.squenceStepTO.index - step2.squenceStepTO.index);
        console.info("sort: ", copyPayload);
      }
      state.currentSequence = copyPayload;
      // if sequence is new save in backend, to get a id.
    },
    setCurrentStepIndex: (state, action: PayloadAction<number | null>) => {
      if (state.currentSequence !== null) {
        if (action.payload === null) {
          const step: SequenceStepCTO = new SequenceStepCTO();
          const newIndex = getLastIndex(state.currentSequence) + 1;
          step.squenceStepTO.index = newIndex;
          step.squenceStepTO.sequenceFk = state.currentSequence.sequenceTO.id;
          state.currentSequence.sequenceStepCTOs.splice(newIndex, 0, step);
          udpateIndices(state.currentSequence);
          state.currentStepIndex = newIndex;
        } else {
          state.currentStepIndex = action.payload;
        }
      } else {
        state.currentStepIndex = action.payload;
      }
    },
    resetCurrentSequence: (state) => {
      state.currentSequence = null;
    },
    resetCurrentStepIndex: (state) => {
      state.currentStepIndex = null;
    },
    setSequences: (state, action: PayloadAction<SequenceCTO[]>) => {
      state.sequences = action.payload;
      if (state.currentSequence !== null) {
        state.currentSequence =
          action.payload.find((sequence) => sequence.sequenceTO.id === state.currentSequence!.sequenceTO.id) || null;
      }
    },
    updateCurrentSequenceStep: (state, action: PayloadAction<SequenceStepCTO>) => {
      if (state.currentStepIndex !== null && state.currentSequence !== null) {
        const stepIndex: number = findStepInSequence(action.payload.squenceStepTO.id, state.currentSequence);
        if (stepIndex !== -1) {
          if (action.payload.squenceStepTO.index !== state.currentStepIndex) {
            // handle index update
            state.currentSequence.sequenceStepCTOs.splice(stepIndex, 1);
            state.currentSequence.sequenceStepCTOs.splice(action.payload.squenceStepTO.index - 1, 0, action.payload);
            state.currentSequence.sequenceStepCTOs.forEach(
              (stepCTO, index) => (stepCTO.squenceStepTO.index = index + 1)
            );
            state.currentStepIndex = action.payload.squenceStepTO.index;
          } else {
            state.currentSequence.sequenceStepCTOs[stepIndex] = action.payload;
          }
          // TODO check what happens when more than one steps have id -1
        }
      }
    },
  },
});

const udpateIndices = (sequence: SequenceCTO): void => {
  sequence.sequenceStepCTOs.forEach((stepCTO, index) => (stepCTO.squenceStepTO.index = index + 1));
};

const getLastIndex = (sequence: SequenceCTO) => {
  if (sequence.sequenceStepCTOs.length === 0) {
    return 0;
  }
  return sequence.sequenceStepCTOs
    .map((stepCTO) => stepCTO.squenceStepTO.index)
    .reduce((prevValue: number, currentValue: number) => (prevValue > currentValue ? prevValue : currentValue));
};

const findStepInSequence = (id: number, sequenceCTO: SequenceCTO): number => {
  return sequenceCTO.sequenceStepCTOs.findIndex((step) => step.squenceStepTO.id === id);
};

export const SequenceReducer = SequenceSlice.reducer;
export const selectSequences = (state: RootState): SequenceCTO[] => state.sequenceModel.sequences;
export const currentSequence = (state: RootState): SequenceCTO | null => state.sequenceModel.currentSequence;
export const currentStepIndex = (state: RootState): number | null => state.sequenceModel.currentStepIndex;
export const currentStep = (state: RootState): SequenceStepCTO | null => {
  return (
    state.sequenceModel.currentSequence?.sequenceStepCTOs.find(
      (step) => step.squenceStepTO.index === state.sequenceModel.currentStepIndex
    ) || null
  );
};

const loadSequencesFromBackend = (): AppThunk => async (dispatch) => {
  console.info("load Sequences from backend.");
  const response: DataAccessResponse<SequenceCTO[]> = await DataAccess.findAllSequences();
  if (response.code === 200) {
    dispatch(SequenceSlice.actions.setSequences(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const saveSequenceThunk = (sequence: SequenceCTO): AppThunk => async (dispatch) => {
  console.log("save sequence thunk with sequence: " + sequence);
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

const deleteSequenceStepThunk = (step: SequenceStepCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceStepCTO> = await DataAccess.deleteSequenceStepCTO(step);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadSequencesFromBackend());
};

export const SequenceActions = {
  updateCurrentSequenceStep: SequenceSlice.actions.updateCurrentSequenceStep,
  setSequenceToEdit: SequenceSlice.actions.setCurrentSequence,
  setSequenceStepToEdit: SequenceSlice.actions.setCurrentStepIndex,
  loadSequencesFromBackend,
  saveSequence: saveSequenceThunk,
  deleteSequence: deleteSequenceThunk,
  deleteSequenceStep: deleteSequenceStepThunk,
};
