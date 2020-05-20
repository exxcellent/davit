import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";

interface ControllPanelState {
  sequences: SequenceTO[];
  selectedComponentToEdit: ComponentCTO | null;
  selectedDataToEdit: DataCTO | null;
  selectedDataRelationToEdit: DataRelationCTO | null;
}
const initialState: ControllPanelState = {
  sequences: [],
  selectedComponentToEdit: null,
  selectedDataToEdit: null,
  selectedDataRelationToEdit: null,
};

export const ControllPanelSlice = createSlice({
  name: "controllPanel",
  initialState: initialState,
  reducers: {
    loadSequences: (state, action: PayloadAction<SequenceTO[]>) => {
      state.sequences = action.payload;
    },
    pickComponentToEdit: (
      state,
      action: PayloadAction<ComponentCTO | null>
    ) => {
      state.selectedComponentToEdit = action.payload;
    },
    pickDataToEdit: (state, action: PayloadAction<DataCTO | null>) => {
      state.selectedDataToEdit = action.payload;
    },
    pickDataRelationToEdit: (
      state,
      action: PayloadAction<DataRelationCTO | null>
    ) => {
      state.selectedDataRelationToEdit = action.payload;
    },
  },
});

export const controllPanelReducer = ControllPanelSlice.reducer;

export const selectSequences = (state: RootState) =>
  state.controllPannel.sequences;

export const selectComponentToEdit = (state: RootState) =>
  state.controllPannel.selectedComponentToEdit;

export const selectDataToEdit = (state: RootState) =>
  state.controllPannel.selectedDataToEdit;

export const selectDataRelationToEdit = (state: RootState) =>
  state.controllPannel.selectedDataRelationToEdit;
