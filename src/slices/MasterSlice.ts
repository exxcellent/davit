import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { ComponentCTO } from "../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../dataAccess/access/cto/DataCTO";
import { DataRelationTO } from "../dataAccess/access/to/DataRelationTO";
import { DataSetupTO } from "../dataAccess/access/to/DataSetupTO";
import { GroupTO } from "../dataAccess/access/to/GroupTO";
import { SequenceTO } from "../dataAccess/access/to/SequenceTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { handleError } from "./GlobalSlice";

interface MasterDataState {
  components: ComponentCTO[];
  groups: GroupTO[];
  datas: DataCTO[];
  relations: DataRelationTO[];
  sequences: SequenceTO[];
  dataSetups: DataSetupTO[];
}
const getInitialState: MasterDataState = {
  components: [],
  groups: [],
  datas: [],
  relations: [],
  sequences: [],
  dataSetups: [],
};

const MasterDataSlice = createSlice({
  name: "masterData",
  initialState: getInitialState,
  reducers: {
    setComponents: (state, action: PayloadAction<ComponentCTO[]>) => {
      state.components = action.payload;
    },
    setGroups: (state, action: PayloadAction<GroupTO[]>) => {
      state.groups = action.payload;
    },
    setDatas: (state, action: PayloadAction<DataCTO[]>) => {
      state.datas = action.payload;
    },
    setRelations: (state, action: PayloadAction<DataRelationTO[]>) => {
      state.relations = action.payload;
    },
    setSequences: (state, action: PayloadAction<SequenceTO[]>) => {
      state.sequences = action.payload;
    },
    setDataSetups: (state, action: PayloadAction<DataSetupTO[]>) => {
      state.dataSetups = action.payload;
    },
  },
});

// =============================================== THUNKS ===============================================

const loadGroupsFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<GroupTO[]> = await DataAccess.findAllGroups();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setGroups(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadComponentsFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ComponentCTO[]> = await DataAccess.findAllComponents();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setComponents(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadDatasFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO[]> = await DataAccess.findAllDatas();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setDatas(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadRelationsFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataRelationTO[]> = await DataAccess.findAllDataRelations();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setRelations(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadSequencesFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceTO[]> = DataAccess.findAllSequences();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setSequences(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadDataSetupsFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupTO[]> = DataAccess.findAllDataSetups();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setDataSetups(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadAll = (): AppThunk => (dispatch) => {
  dispatch(loadGroupsFromBackend());
  dispatch(loadComponentsFromBackend());
  dispatch(loadDataSetupsFromBackend());
  dispatch(loadRelationsFromBackend());
  dispatch(loadSequencesFromBackend());
  dispatch(loadDatasFromBackend());
};

// =============================================== SELECTORS ===============================================

export const MasterDataReducer = MasterDataSlice.reducer;
export const selectComponents = (state: RootState): ComponentCTO[] => state.masterData.components;
export const selectGroups = (state: RootState): GroupTO[] => state.masterData.groups;
export const selectDatas = (state: RootState): DataCTO[] => state.masterData.datas;
export const selectRelations = (state: RootState): DataRelationTO[] => state.masterData.relations;
export const selectSequences = (state: RootState): SequenceTO[] => state.masterData.sequences;
export const selectDataSetup = (state: RootState): DataSetupTO[] => state.masterData.dataSetups;

// =============================================== ACTIONS ===============================================

export const MasterDataActions = {
  loadGroupsFromBackend,
  loadComponentsFromBackend,
  loadDataSetupsFromBackend,
  loadRelationsFromBackend,
  loadSequencesFromBackend,
  loadDatasFromBackend,
  loadAll,
};
