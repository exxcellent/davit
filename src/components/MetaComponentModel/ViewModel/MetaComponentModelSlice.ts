import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import ComponentTO from "../../common/access/ComponentTO";

interface MetaComponentModelState {
  components: ComponentTO[];
}
const initialState: MetaComponentModelState = { components: [] };

export const metaComponentModelSlice = createSlice({
  name: "metaComponentModel",
  initialState: initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<ComponentTO>) => {
      console.info(action.payload);
      state.components.push(action.payload);
    },
    deleteComponent: (state, action: PayloadAction<ComponentTO>) => {
      let i: number;
      for (i = 0; i < state.components.length; i++) {
        if (state.components[i].id === action.payload.id) {
          state.components.splice(i, 1);
          break;
        }
      }
    },
  },
});

export const {
  addComponent,
  deleteComponent,
} = metaComponentModelSlice.actions;

export const metaComponentModelReducer = metaComponentModelSlice.reducer;

export const selectComponents = (state: RootState) =>
  state.metaComponentModel.components;
