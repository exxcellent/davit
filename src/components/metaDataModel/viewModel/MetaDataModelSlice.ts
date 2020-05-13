import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataConnectionTO } from "../../../dataAccess/access/to/DataConnectionTO";

interface MetaDataModelState {
  datas: DataCTO[];
  dataConnections: DataConnectionTO[];
}
const initialState: MetaDataModelState = { datas: [], dataConnections: [] };

export const metaDataModelSlice = createSlice({
  name: "metaDataModel",
  initialState: initialState,
  reducers: {
    loadDatas: (state, action: PayloadAction<DataCTO[]>) => {
      state.datas = action.payload;
    },
    loadDataConnections: (state, action: PayloadAction<DataConnectionTO[]>) => {
      state.dataConnections = action.payload;
    },
  },
});

export const metaDataModelReducer = metaDataModelSlice.reducer;

export const selectDatas = (state: RootState) => state.metaDataModel.datas;
export const selectDataConnections = (state: RootState) =>
  state.metaDataModel.dataConnections;
