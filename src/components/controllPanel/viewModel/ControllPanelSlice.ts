import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";

interface ControllPanelState {
  sequences: SequenceTO[];
}
const initialState: ControllPanelState = { sequences: [] };

export const ControllPanelSlice = createSlice({
  name: "controllPanel",
  initialState: initialState,
  reducers: {
    loadSequences: (state, action: PayloadAction<SequenceTO[]>) => {
      state.sequences = action.payload;
    },
  },
});

export const controllPanelReducer = ControllPanelSlice.reducer;

export const selectSequences = (state: RootState) =>
  state.controllPannel.sequences;
