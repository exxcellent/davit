import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { DataCTO } from "../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../dataAccess/access/cto/DataRelationCTO";

interface DataState {
  currentData: DataCTO | null;
  currentRelation: DataRelationCTO | null;
}
const getInitialState: DataState = {
  currentData: null,
  currentRelation: null,
};

export const DataSlice = createSlice({
  name: "data",
  initialState: getInitialState,
  reducers: {
    setCurrentData: (state, action: PayloadAction<DataCTO | null>) => {
      state.currentData = action.payload;
    },
    setCurrentRelation: (state, action: PayloadAction<DataRelationCTO | null>) => {
      state.currentRelation = action.payload;
    },
  },
});

export const DataReducer = DataSlice.reducer;

export const currentData = (state: RootState): DataCTO | null => state.dataModel.currentData;
export const currentRelation = (state: RootState): DataRelationCTO | null => state.dataModel.currentRelation;
