import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { ComponentDataCTO } from "../../../dataAccess/access/cto/ComponentDataCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";

interface ControllPanelState {
  sequences: SequenceCTO[];
  selectedComponentToEdit: ComponentCTO | null;
  selectedDataToEdit: DataCTO | null;
  selectedDataRelationToEdit: DataRelationCTO | null;
  selectedSequenceToEdit: SequenceCTO | null;
  selectedSequenceStepToEdit: SequenceStepCTO | null;
  selectedComponentDatasToEdit: ComponentDataCTO[] | null;
}
const initialState: ControllPanelState = {
  sequences: [],
  selectedComponentToEdit: null,
  selectedDataToEdit: null,
  selectedDataRelationToEdit: null,
  selectedSequenceToEdit: null,
  selectedSequenceStepToEdit: null,
  selectedComponentDatasToEdit: null,
};

export const ControllPanelSlice = createSlice({
  name: "controllPanel",
  initialState: initialState,
  reducers: {
    loadSequences: (state, action: PayloadAction<SequenceCTO[]>) => {
      state.sequences = action.payload;
    },
    pickComponentToEdit: (
      state,
      action: PayloadAction<ComponentCTO | null>
    ) => {
      console.log("Set component to edit", action.payload);
      state.selectedComponentToEdit = action.payload;
    },
    pickDataToEdit: (state, action: PayloadAction<DataCTO | null>) => {
      console.log("Set data to edit", action.payload);
      state.selectedDataToEdit = action.payload;
    },
    pickDataRelationToEdit: (
      state,
      action: PayloadAction<DataRelationCTO | null>
    ) => {
      console.log("Set relation to edit", action.payload);
      state.selectedDataRelationToEdit = action.payload;
    },

    pickSequenceToEdit: (state, action: PayloadAction<SequenceCTO | null>) => {
      console.log("Set sequence to edit", action.payload);
      state.selectedSequenceToEdit = action.payload;
    },

    pickSequenceStepToEdit: (
      state,
      action: PayloadAction<SequenceStepCTO | null>
    ) => {
      console.log("Set step to edit", action.payload);
      state.selectedSequenceStepToEdit = action.payload;
    },

    pickComponentDatasToEdit: (
      state,
      action: PayloadAction<ComponentDataCTO[] | null>
    ) => {
      console.log("Set componentdata to edit", action.payload);
      state.selectedComponentDatasToEdit = action.payload;
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

export const selectSequenceToEdit = (state: RootState) =>
  state.controllPannel.selectedSequenceToEdit;

export const selectSequenceStepToEdit = (state: RootState) =>
  state.controllPannel.selectedSequenceStepToEdit;

export const selectComponentDatasToEdit = (state: RootState) =>
  state.controllPannel.selectedComponentDatasToEdit;
