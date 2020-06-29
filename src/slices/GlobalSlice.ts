import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";

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
    // TODO: workaround, es gibt bestimmt eine bessere Lösung.
    window.location.reload(true);
  } else {
    dispatch(handleError(response.message));
  }
};

const downloadData = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<void> = DataAccess.downloadData();
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
};

export const GlobalActions = {
  storefileData,
  downloadData,
};

export const { handleError } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;

export const selectGlobalErrorState = (state: RootState) => state.global.errors;
export const selectMode = (state: RootState) => state.global.mode;
