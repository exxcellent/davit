import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";

interface MetaDataModelState {
  datas: DataCTO[];
  dataRelations: DataRelationCTO[];
}
const initialState: MetaDataModelState = { datas: [], dataRelations: [] };

export const metaDataModelSlice = createSlice({
  name: "metaDataModel",
  initialState: initialState,
  reducers: {
    loadDatas: (state, action: PayloadAction<DataCTO[]>) => {
      state.datas = action.payload;
    },
    loadDataRelations: (state, action: PayloadAction<DataRelationCTO[]>) => {
      state.dataRelations = action.payload;
    },
  },
});

export const metaDataModelReducer = metaDataModelSlice.reducer;

export const selectDatas = (state: RootState) => state.metaDataModel.datas;
export const selectDataRelations = (state: RootState) =>
  state.metaDataModel.dataRelations;
