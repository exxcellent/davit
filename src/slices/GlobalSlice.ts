import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";

interface GlobalState {
  errors: string[];
}
const getInitialState = (): GlobalState => {
  return {
    errors: [],
  };
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

const downloadData = (projectName: string): AppThunk => (dispatch) => {
  const response: DataAccessResponse<void> = DataAccess.downloadData(projectName);
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
