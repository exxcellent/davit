import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../../app/store";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";

const MODE_LOCAL_STORAGE = "MODE";

export enum Mode {
  EDIT = "EDIT",
  VIEW = "VIEW",
  EDIT_COMPONENT = "EDIT_COMPONENT",
  EDIT_DATA = "EDIT_DATA",
  EDIT_DATA_RELATION = "EDIT_DATA_RELATION",
  EDIT_SEQUENCE = "EDIT_SEQUENCE",
  EDIT_SEQUENCE_STEP = "EDIT_SEQUENCE_STEP",
  EDIT_SEQUENCE_STEP_COMPONENT_DATA = "EDIT_SEQUENCE_STEP_COMPONENT_DATA",
}

interface GlobalState {
  errors: string[];
  sequence: SequenceCTO | undefined;
  selectedStep: SequenceStepCTO | undefined;
  mode: Mode;
}
const getInitialState = (): GlobalState => {
  return {
    errors: [],
    mode: determinInitalMode(),
    sequence: undefined,
    selectedStep: undefined,
  };
};

const determinInitalMode = () => {
  const mode: string | null = localStorage.getItem(MODE_LOCAL_STORAGE);
  return mode ? Mode[mode as Mode] : Mode.VIEW;
};

export const globalSlice = createSlice({
  name: "global",
  initialState: getInitialState(),
  reducers: {
    handleError: (state, action: PayloadAction<string>) => {
      state.errors.push(action.payload);
    },
    clearErrors: (state) => {
      state.errors = [];
    },
    setMode: (state, action: PayloadAction<Mode>) => {
      console.log("setting mode " + action.payload);
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
    previousStep: (state) => {
      if (state.selectedStep) {
        state.selectedStep = state.sequence?.sequenceStepCTOs.find(
          (step) =>
            step.squenceStepTO.index ===
            state.selectedStep!.squenceStepTO.index - 1
        );
      } else {
        state.selectedStep =
          state.sequence?.sequenceStepCTOs[
            state.sequence?.sequenceStepCTOs.length - 1
          ];
      }
    },
  },
});

export const setModeWithStorage = (mode: Mode): AppThunk => async (
  dispatch
) => {
  localStorage.setItem(MODE_LOCAL_STORAGE, mode);
  dispatch(setMode(mode));
};

export const { handleError } = globalSlice.actions;
const { setMode } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;

export const selectGlobalErrorState = (state: RootState) => state.global.errors;
export const selectMode = (state: RootState) => state.global.mode;
export const selectSequence = (state: RootState) => state.global.sequence;
export const selectStep = (state: RootState) => state.global.selectedStep;
