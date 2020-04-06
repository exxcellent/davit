import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ComponentTo } from "../access/ComponentTo";
import { RootState } from "../../../app/store";

interface MetaComponentModelState {
  components: ComponentTo[];
}
const initialState: MetaComponentModelState = { components: [] };

export const metaComponentModelSlice = createSlice({
  name: "metaComponentModel",
  initialState: initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<ComponentTo>) => {
      state.components.push(action.payload);
    }
  }
});

export const {addComponent} = metaComponentModelSlice.actions;

export const metaComponentModelReducer = metaComponentModelSlice.reducer;

export const selectComponents = (state: RootState) =>
  state.metaComponentModel.components;
