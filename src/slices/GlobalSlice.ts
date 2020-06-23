import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { ActionCTO } from "../dataAccess/access/cto/ActionCTO";
import { ComponentCTO } from "../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../dataAccess/access/cto/DataRelationCTO";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { GroupTO } from "../dataAccess/access/to/GroupTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { ComponentActions, ComponentInternalActions } from "./ComponentSlice";
import { DataActions, DataInternalActions } from "./DataSlice";
import { SequenceActions, SequenceSlice } from "./SequenceSlice";

const MODE_LOCAL_STORAGE = "MODE";

export enum Mode {
  FILE = "FILE",
  VIEW = "VIEW",
  EDIT = "EDIT",
  EDIT_COMPONENT = "EDIT_COMPONENT",
  EDIT_GROUP = "EDIT_GROUP",
  EDIT_DATA = "EDIT_DATA",
  EDIT_DATA_RELATION = "EDIT_DATA_RELATION",
  EDIT_DATA_SETUP = "EDIT_DATA_SETUP",
  EDIT_SEQUENCE = "EDIT_SEQUENCE",
  EDIT_SEQUENCE_STEP = "EDIT_SEQUENCE_STEP",
  EDIT_SEQUENCE_STEP_ACTION = "EDIT_SEQUENCE_STEP_ACTION",
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
      state.mode = action.payload;
    },
  },
});

const storefileData = (fileData: string): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<void> = await DataAccess.storeFileData(fileData);
  if (response.code === 200) {
    // dispatch(findAllComponents());
    // TODO: workaround, es gibt bestimmt eine bessere Lösung.
    window.location.reload(true);
  } else {
    dispatch(handleError(response.message));
  }
};

const downloadData = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<void> = DataAccess.downloadData();
  if (response.code === 200) {
  } else {
    dispatch(handleError(response.message));
  }
};

export const setModeWithStorage = (mode: Mode): AppThunk => async (dispatch) => {
  localStorage.setItem(MODE_LOCAL_STORAGE, mode);
  dispatch(globalSlice.actions.setMode(mode));
};

const reset = (): AppThunk => async (dispatch) => {
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
  dispatch(SequenceSlice.actions.resetCurrentStepIndex());
  dispatch(SequenceSlice.actions.setCurrentSequence(sequence || new SequenceCTO()));
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE));
};

const setModeToEditCurrentSequence = (): AppThunk => async (dispatch) => {
  dispatch(reset());
  dispatch(SequenceSlice.actions.resetCurrentStepIndex());
  dispatch(SequenceActions.loadSequencesFromBackend());
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE));
};

const setModeToEditStep = (stepIndex?: number): AppThunk => async (dispatch) => {
  dispatch(SequenceActions.setSequenceStepToEdit(stepIndex || null));
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_STEP));
};

const setModeToEditAction = (action?: ActionCTO): AppThunk => async (dispatch) => {
  dispatch(SequenceActions.setActionToEdit(action || new ActionCTO()));
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_STEP_ACTION));
};

const setModeToEditGroup = (group?: GroupTO): AppThunk => async (dispatch) => {
  dispatch(ComponentActions.setGroupToEdit(group || new GroupTO()));
  dispatch(setModeWithStorage(Mode.EDIT_GROUP));
};

const setModeToEditDataSetup = (dataSetup?: DataSetupCTO): AppThunk => async (dispatch) => {
  dispatch(SequenceActions.setDataSetupToEdit(dataSetup || new DataSetupCTO()));
  dispatch(setModeWithStorage(Mode.EDIT_DATA_SETUP));
};

export const GlobalActions = {
  setModeToView,
  setModeToEdit,
  setModeToEditComponent,
  setModeToEditData,
  setModeToEditRelation,
  setModeToEditSequence,
  setModeToEditCurrentSequence,
  setModeToEditStep,
  storefileData,
  downloadData,
  setModeToEditGroup,
  setModeToEditAction,
  setModeToEditDataSetup,
};

export const { handleError } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;

export const selectGlobalErrorState = (state: RootState) => state.global.errors;
export const selectMode = (state: RootState) => state.global.mode;
