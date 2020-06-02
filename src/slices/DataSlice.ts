import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { handleError } from "../components/common/viewModel/GlobalSlice";
import { DataCTO } from "../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../dataAccess/access/cto/DataRelationCTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";

interface DataState {
  datas: DataCTO[];
  relations: DataRelationCTO[];
  currentData: DataCTO | null;
  currentRelation: DataRelationCTO | null;
}
const getInitialState: DataState = {
  datas: [],
  relations: [],
  currentData: null,
  currentRelation: null,
};

const DataSlice = createSlice({
  name: "data",
  initialState: getInitialState,
  reducers: {
    setCurrentData: (state, action: PayloadAction<DataCTO | null>) => {
      state.currentData = action.payload;
    },
    setCurrentRelation: (state, action: PayloadAction<DataRelationCTO | null>) => {
      state.currentRelation = action.payload;
    },
    resetCurrentData: (state) => {
      state.currentData = null;
    },
    resetCurrentRelation: (state) => {
      state.currentRelation = null;
    },
    setDatas: (state, action: PayloadAction<DataCTO[]>) => {
      state.datas = action.payload;
    },
    setRelations: (state, action: PayloadAction<DataRelationCTO[]>) => {
      state.relations = action.payload;
    },
  },
});

export const DataReducer = DataSlice.reducer;

export const selectCurrentData = (state: RootState): DataCTO | null => state.dataModel.currentData;
export const selectCurrentRelation = (state: RootState): DataRelationCTO | null => state.dataModel.currentRelation;
export const selectDatas = (state: RootState): DataCTO[] => state.dataModel.datas;
export const selectRelations = (state: RootState): DataRelationCTO[] => state.dataModel.relations;

const loadDatasFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO[]> = await DataAccess.findAllDatas();
  if (response.code === 200) {
    dispatch(DataSlice.actions.setDatas(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadRelationsFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataRelationCTO[]> = await DataAccess.findAllDataRelations();
  if (response.code === 200) {
    dispatch(DataSlice.actions.setRelations(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const saveDataThunk = (data: DataCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO> = await DataAccess.saveDataCTO(data);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadDatasFromBackend());
};

const saveRelationThunk = (relation: DataRelationCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataRelationCTO> = await DataAccess.saveDataRelationCTO(relation);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadRelationsFromBackend());
};

const deleteDataThunk = (data: DataCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO> = await DataAccess.deleteDataCTO(data);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadDatasFromBackend());
};

const deleteRelationThunk = (relation: DataRelationCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataRelationCTO> = await DataAccess.deleteDataRelation(relation);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadRelationsFromBackend());
};

export const DataActions = {
  setDataToEdit: DataSlice.actions.setCurrentData,
  setRelationToEdit: DataSlice.actions.setCurrentRelation,
  loadDatasFromBackend,
  loadRelationsFromBackend,
  saveData: saveDataThunk,
  saveRelation: saveRelationThunk,
  deleteData: deleteDataThunk,
  deleteRelation: deleteRelationThunk,
};

export const DataInternalActions = {
  resetCurrentData: DataSlice.actions.resetCurrentData,
  resetCurrentRelation: DataSlice.actions.resetCurrentRelation,
};
