import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";

export enum Mode {
  EDIT = "EDIT",
  VIEW = "VIEW",
}

interface GlobalState {
  errors: string[];
  sequence: SequenceCTO | undefined;
  selectedStep: SequenceStepCTO | undefined;
  mode: Mode;
}
const initialState: GlobalState = {
  errors: [],
  mode: Mode.VIEW,
  sequence: undefined,
  selectedStep: undefined,
};

export const globalSlice = createSlice({
  name: "global",
  initialState: initialState,
  reducers: {
    handleError: (state, action: PayloadAction<string>) => {
      state.errors.push(action.payload);
    },
    clearErrors: (state) => {
      state.errors = [];
    },
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
    setSequence: (state, action: PayloadAction<SequenceCTO>) => {
      action.payload.sequenceStepCTOs.sort(
        (step1, step2) => step1.squenceStepTO.index - step2.squenceStepTO.index
      );
      state.sequence = action.payload;
      state.selectedStep = action.payload.sequenceStepCTOs[0];
    },
    nextStep: (state) => {
      if (state.selectedStep) {
        state.selectedStep = state.sequence?.sequenceStepCTOs.find(
          (step) =>
            step.squenceStepTO.index > state.selectedStep!.squenceStepTO.index
        );
      } else {
        state.selectedStep = state.sequence?.sequenceStepCTOs[0];
      }
    },
  },
});

export const { handleError } = globalSlice.actions;
export const { setMode } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;

export const selectGlobalErrorState = (state: RootState) => state.global.errors;
export const selectGlobalModeState = (state: RootState) => state.global.mode;
export const selectSequence = (state: RootState) => state.global.sequence;
export const selectStep = (state: RootState) => state.global.selectedStep;
