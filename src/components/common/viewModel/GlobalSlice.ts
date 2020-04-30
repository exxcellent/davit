import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";

enum Mode {
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
    switchMode: (state) => {
      console.info("Change Operation Mode!");
      switch (state.mode) {
        case Mode.VIEW:
          state.mode = Mode.EDIT;
          break;
        case Mode.EDIT:
          state.mode = Mode.VIEW;
          break;
      }
    },
    setSequence: (state, action: PayloadAction<SequenceCTO>) => {
      action.payload.sequenceStepCTOs.sort(
        (step1, step2) => step1.step.index - step2.step.index
      );
      state.sequence = action.payload;
      state.selectedStep = action.payload.sequenceStepCTOs[0];
    },
    nextStep: (state) => {
      if (state.selectedStep) {
        state.selectedStep = state.sequence?.sequenceStepCTOs.find(
          (step) => step.step.index > state.selectedStep!.step.index
        );
      } else {
        state.selectedStep = state.sequence?.sequenceStepCTOs[0];
      }
    },
  },
});

export const { handleError } = globalSlice.actions;
export const { switchMode } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;

export const selectGlobalErrorState = (state: RootState) => state.global.errors;
export const selectGlobalModeState = (state: RootState) => state.global.mode;
export const selectSequence = (state: RootState) => state.global.sequence;
export const selectStep = (state: RootState) => state.global.selectedStep;
