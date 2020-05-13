import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { DataConnectionCTO } from "../../../dataAccess/access/cto/DataConnectionCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";

interface MetaDataModelState {
  datas: DataCTO[];
  dataConnections: DataConnectionCTO[];
}
const initialState: MetaDataModelState = { datas: [], dataConnections: [] };

export const metaDataModelSlice = createSlice({
  name: "metaDataModel",
  initialState: initialState,
  reducers: {
    loadDatas: (state, action: PayloadAction<DataCTO[]>) => {
      state.datas = action.payload;
    },
    loadDataConnections: (
      state,
      action: PayloadAction<DataConnectionCTO[]>
    ) => {
      state.dataConnections = action.payload;
    },
  },
});

export const metaDataModelReducer = metaDataModelSlice.reducer;

export const selectDatas = (state: RootState) => state.metaDataModel.datas;
export const selectDataConnections = (state: RootState) =>
  state.metaDataModel.dataConnections;
