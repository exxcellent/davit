import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { DataSetupTO } from "../dataAccess/access/to/DataSetupTO";
import { InitDataTO } from "../dataAccess/access/to/InitDataTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { handleError } from "./GlobalSlice";

interface DataSetupState {
  dataSetups: DataSetupTO[];
  initDatas: InitDataTO[];
  currentDataSetupToEdit: DataSetupCTO | null;
}
const getInitialState: DataSetupState = {
  dataSetups: [],
  initDatas: [],
  currentDataSetupToEdit: null,
};

export const DataSetupSlice = createSlice({
  name: "dataSetup",
  initialState: getInitialState,
  reducers: {
    setDataSetups: (state, action: PayloadAction<DataSetupTO[]>) => {
      state.dataSetups = action.payload;
    },
    setCurrentDataSetup: (state, action: PayloadAction<DataSetupCTO | null>) => {
      state.currentDataSetupToEdit = action.payload;
    },
    setInitDatas: (state, action: PayloadAction<InitDataTO[]>) => {
      state.initDatas = action.payload;
    },
  },
});

export const DataSetupReducer = DataSetupSlice.reducer;
export const selectDataSetups = (state: RootState): DataSetupTO[] => state.sequenceModel.dataSetups;
export const selectInitDatas = (state: RootState): InitDataTO[] => state.sequenceModel.initDatas;
export const currentDataSetupToEdit = (state: RootState): DataSetupCTO | null =>
  state.sequenceModel.currentDataSetupToEdit;

const loadDataSetupsFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupTO[]> = DataAccess.findAllDataSetups();
  if (response.code === 200) {
    dispatch(DataSetupSlice.actions.setDataSetups(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadInitDataFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<InitDataTO[]> = DataAccess.findAllInitDatas();
  if (response.code === 200) {
    dispatch(DataSetupSlice.actions.setInitDatas(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const saveDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.saveDataSetupCTO(dataSetup);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadDataSetupsFromBackend());
};

const deleteDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = await DataAccess.deleteDataSetup(dataSetup);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadDataSetupsFromBackend());
};

const setDataSetupToEdit = (dataSetupTO: DataSetupTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.findDataSetupCTO(dataSetupTO);
  if (response.code === 200) {
    dispatch(DataSetupSlice.actions.setCurrentDataSetup(response.object));
    dispatch(loadDataSetupsFromBackend());
  } else {
    dispatch(handleError(response.message));
  }
};

export const SequenceActions = {
  loadDataSetupsFromBackend,
  setDataSetupToEdit,
  saveDataSetup: saveDataSetupThunk,
  deleteDataSetup: deleteDataSetupThunk,
  loadInitDataFromBackend,
  updateCurrentDataSetupToEdit: DataSetupSlice.actions.setCurrentDataSetup,
  clearCurrentDataSetupToEdit: DataSetupSlice.actions.setCurrentDataSetup(null),
};
