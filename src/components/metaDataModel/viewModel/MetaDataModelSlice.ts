import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";

interface MetaDataModelState {
  datas: DataCTO[];
}
const initialState: MetaDataModelState = { datas: [] };

export const metaDataModelSlice = createSlice({
  name: "metaDataModel",
  initialState: initialState,
  reducers: {
    loadDatas: (state, action: PayloadAction<DataCTO[]>) => {
      state.datas = action.payload;
    },
  },
});

export const metaDataModelReducer = metaDataModelSlice.reducer;

export const selectDatas = (state: RootState) => state.metaDataModel.datas;
