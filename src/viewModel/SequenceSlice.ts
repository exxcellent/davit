import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";

interface SequenceState {
  currentSequence: SequenceCTO | null;
  currentStepIndex: number | null;
}
const getInitialState: SequenceState = {
  currentSequence: null,
  currentStepIndex: null,
};

export const SequenceSlice = createSlice({
  name: "sequence",
  initialState: getInitialState,
  reducers: {
    setCurrentSequence: (state, action: PayloadAction<SequenceCTO>) => {
      action.payload.sequenceStepCTOs.sort((step1, step2) => step1.squenceStepTO.index - step2.squenceStepTO.index);
      state.currentSequence = action.payload;
    },
    setCurrentStepIndex: (state, action: PayloadAction<number>) => {
      state.currentStepIndex = action.payload;
      // state.currentSequence?.sequenceStepCTOs.find((step) => step.squenceStepTO.index === action.payload) || null;
    },
    // incrementCurrentStep: (state): void => {
    //   state.currentStep =
    //     state.currentSequence?.sequenceStepCTOs.find(
    //       (step) => step.squenceStepTO.index > (state.currentStep?.squenceStepTO.index || -1)
    //     ) || null;
    // },
    // addNewStep: (state, action: PayloadAction<number>) => {
    //   const sequenceStepCTO: SequenceStepCTO | undefined = state.currentSequence?.sequenceStepCTOs.find(
    //     (step) => step.squenceStepTO.index === action.payload
    //   );
    // },
  },
});

export const SequenceReducer = SequenceSlice.reducer;

export const currentSequence = (state: RootState): SequenceCTO | null => state.sequenceModel.currentSequence;

const currentStepIndex = (state: RootState): number | null => state.sequenceModel.currentStepIndex;

export const currentStep = (state: RootState): SequenceStepCTO | null => {
  return (
    currentSequence(state)?.sequenceStepCTOs.find((step) => step.squenceStepTO.index === currentStepIndex(state)) ||
    null
  );
};
