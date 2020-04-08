import {
  createSlice,
  PayloadAction,
  bindActionCreators,
} from "@reduxjs/toolkit";
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
    },
    deleteComponent: (state, action: PayloadAction<ComponentTo>) => {
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
