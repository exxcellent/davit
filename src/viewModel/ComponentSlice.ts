import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { ComponentCTO } from "../dataAccess/access/cto/ComponentCTO";

interface ComponentState {
  currentComponent: ComponentCTO | null;
}
const getInitialState: ComponentState = {
  currentComponent: null,
};

export const ComponentSlice = createSlice({
  name: "component",
  initialState: getInitialState,
  reducers: {
    setCurrentComponent: (state, action: PayloadAction<ComponentCTO | null>) => {
      state.currentComponent = action.payload;
    },
  },
});

export const ComponentReducer = ComponentSlice.reducer;

export const currentComponent = (state: RootState): ComponentCTO | null => state.componentModel.currentComponent;
