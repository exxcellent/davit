import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";

interface MetaComponentModelState {
  components: ComponentCTO[];
}
const initialState: MetaComponentModelState = { components: [] };

export const metaComponentModelSlice = createSlice({
  name: "metaComponentModel",
  initialState: initialState,
  reducers: {
    loadComponents: (state, action: PayloadAction<ComponentCTO[]>) => {
      state.components = action.payload;
    },
  },
});

export const metaComponentModelReducer = metaComponentModelSlice.reducer;

export const selectComponents = (state: RootState) =>
  state.metaComponentModel.components;
