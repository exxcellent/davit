import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";

interface ControllPanelState {
  sequences: SequenceTO[];
  selectedComponentToEdit: ComponentCTO | null;
  selectedDataToEdit: DataCTO | null;
}
const initialState: ControllPanelState = {
  sequences: [],
  selectedComponentToEdit: null,
  selectedDataToEdit: null,
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
  },
});

export const controllPanelReducer = ControllPanelSlice.reducer;

export const selectSequences = (state: RootState) =>
  state.controllPannel.sequences;

export const selectComponentToEdit = (state: RootState) =>
  state.controllPannel.selectedComponentToEdit;

export const selectDataToEdit = (state: RootState) =>
  state.controllPannel.selectedDataToEdit;
