import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { ComponentCTO } from "../dataAccess/access/cto/ComponentCTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { handleError } from "./GlobalSlice";

interface ComponentState {
  currentComponent: ComponentCTO | null;
  components: ComponentCTO[];
}
const getInitialState: ComponentState = {
  currentComponent: null,
  components: [],
};

const ComponentSlice = createSlice({
  name: "component",
  initialState: getInitialState,
  reducers: {
    setCurrentComponent: (state, action: PayloadAction<ComponentCTO | null>) => {
      state.currentComponent = action.payload;
    },
    setComponents: (state, action: PayloadAction<ComponentCTO[]>) => {
      state.components = action.payload;
    },
    resetCurrentComponent: (state) => {
      state.currentComponent = null;
    },
  },
});

export const ComponentReducer = ComponentSlice.reducer;

export const currentComponent = (state: RootState): ComponentCTO | null => state.componentModel.currentComponent;

export const selectComponents = (state: RootState): ComponentCTO[] => state.componentModel.components;

const loadComponentsFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ComponentCTO[]> = await DataAccess.findAllComponents();
  if (response.code === 200) {
    dispatch(ComponentSlice.actions.setComponents(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const saveComponentThunk = (component: ComponentCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ComponentCTO> = await DataAccess.saveComponentCTO(component);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadComponentsFromBackend());
};

const deleteComponentThunk = (component: ComponentCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ComponentCTO> = await DataAccess.deleteComponentCTO(component);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadComponentsFromBackend());
};

export const ComponentActions = {
  setCompoenentToEdit: ComponentSlice.actions.setCurrentComponent,
  loadComponentsFromBackend,
  saveComponent: saveComponentThunk,
  deleteComponent: deleteComponentThunk,
};

export const ComponentInternalActions = {
  resetCurrentComponent: ComponentSlice.actions.resetCurrentComponent,
};
