import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../../app/store";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { ComponentActions, ComponentInternalActions } from "../../../slices/ComponentSlice";
import { DataActions, DataInternalActions } from "../../../slices/DataSlice";
import { SequenceSlice } from "../../../slices/SequenceSlice";

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
  mode: Mode;
}
const getInitialState = (): GlobalState => {
  return {
    errors: [],
    mode: determinInitalMode(),
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
  },
});

export const setModeWithStorage = (mode: Mode): AppThunk => async (dispatch) => {
  console.log("setMode", mode);
  localStorage.setItem(MODE_LOCAL_STORAGE, mode);
  dispatch(globalSlice.actions.setMode(mode));
};

const reset = (): AppThunk => async (dispatch) => {
  console.log("reset");
  dispatch(ComponentInternalActions.resetCurrentComponent());
  dispatch(DataInternalActions.resetCurrentData());
  dispatch(DataInternalActions.resetCurrentRelation());
};

const setModeToView = (): AppThunk => async (dispatch) => {
  dispatch(reset());
  dispatch(setModeWithStorage(Mode.VIEW));
};

const setModeToEdit = (): AppThunk => async (dispatch) => {
  dispatch(reset());
  dispatch(setModeWithStorage(Mode.EDIT));
};

const setModeToEditComponent = (component?: ComponentCTO): AppThunk => async (dispatch) => {
  dispatch(reset());
  dispatch(setModeWithStorage(Mode.EDIT_COMPONENT));
  dispatch(ComponentActions.setCompoenentToEdit(component || new ComponentCTO()));
};

const setModeToEditData = (data?: DataCTO): AppThunk => async (dispatch) => {
  dispatch(reset());
  dispatch(DataActions.setDataToEdit(data || new DataCTO()));
  dispatch(setModeWithStorage(Mode.EDIT_DATA));
};

const setModeToEditRelation = (relation?: DataRelationCTO): AppThunk => async (dispatch) => {
  dispatch(reset());
  dispatch(DataActions.setRelationToEdit(relation || new DataRelationCTO()));
  dispatch(setModeWithStorage(Mode.EDIT_DATA_RELATION));
};

const setModeToEditSequence = (sequence?: SequenceCTO): AppThunk => async (dispatch) => {
  dispatch(reset());
  dispatch(SequenceSlice.actions.setCurrentSequence(sequence || new SequenceCTO()));
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE));
};

const setModeToEditCurrentSequence = (): AppThunk => async (dispatch) => {
  dispatch(reset());
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE));
};

export const GlobalActions = {
  setModeToView,
  setModeToEdit,
  setModeToEditComponent,
  setModeToEditData,
  setModeToEditRelation,
  setModeToEditSequence,
  setModeToEditCurrentSequence,
};

export const { handleError } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;

export const selectGlobalErrorState = (state: RootState) => state.global.errors;
export const selectMode = (state: RootState) => state.global.mode;
