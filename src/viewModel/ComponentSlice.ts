import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { ComponentCTO } from "../dataAccess/access/cto/ComponentCTO";

interface ComponentState {
  currentComponent: ComponentCTO | null;
  components: ComponentCTO[];
}
const getInitialState: ComponentState = {
  currentComponent: null,
  components: [],
};

export const ComponentSlice = createSlice({
  name: "component",
  initialState: getInitialState,
  reducers: {
    setCurrentComponent: (state, action: PayloadAction<ComponentCTO | null>) => {
      state.currentComponent = action.payload;
    },
    setComponents: (state, action: PayloadAction<ComponentCTO[]>) => {
      state.components = action.payload;
    },
  },
});

export const ComponentReducer = ComponentSlice.reducer;

export const currentComponent = (state: RootState): ComponentCTO | null => state.componentModel.currentComponent;

export const selectComponents = (state: RootState): ComponentCTO[] => state.componentModel.components;
