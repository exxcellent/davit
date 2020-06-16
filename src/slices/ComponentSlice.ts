import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { ComponentCTO } from "../dataAccess/access/cto/ComponentCTO";
import { GroupTO } from "../dataAccess/access/to/GroupTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { handleError } from "./GlobalSlice";

interface ComponentState {
  currentComponent: ComponentCTO | null;
  components: ComponentCTO[];
  groups: GroupTO[];
  currentGroup: GroupTO | null;
}
const getInitialState: ComponentState = {
  currentComponent: null,
  components: [],
  groups: [],
  currentGroup: null,
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

    setGroups: (state, action: PayloadAction<GroupTO[]>) => {
      state.groups = action.payload;
    },

    setCurrentGroup: (state, action: PayloadAction<GroupTO | null>) => {
      state.currentGroup = action.payload;
    },

    resetCurrentComponent: (state) => {
      state.currentComponent = null;
    },
  },
});

export const ComponentReducer = ComponentSlice.reducer;
export const currentComponent = (state: RootState): ComponentCTO | null => state.componentModel.currentComponent;
export const selectComponents = (state: RootState): ComponentCTO[] => state.componentModel.components;
export const selectGroups = (state: RootState): GroupTO[] => state.componentModel.groups;
export const currentGroup = (state: RootState): GroupTO | null => state.componentModel.currentGroup;

const loadGroupsFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<GroupTO[]> = await DataAccess.findAllGroups();
  if (response.code === 200) {
    dispatch(ComponentSlice.actions.setGroups(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

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

const saveGroupThunk = (group: GroupTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<GroupTO> = await DataAccess.saveGroup(group);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadGroupsFromBackend());
};

const deleteComponentThunk = (component: ComponentCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ComponentCTO> = await DataAccess.deleteComponentCTO(component);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadComponentsFromBackend());
};

const deleteGroupThunk = (group: GroupTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<GroupTO> = await DataAccess.deleteGroupTO(group);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadGroupsFromBackend());
  dispatch(loadComponentsFromBackend());
};

export const ComponentActions = {
  setCompoenentToEdit: ComponentSlice.actions.setCurrentComponent,
  loadComponentsFromBackend,
  saveComponent: saveComponentThunk,
  deleteComponent: deleteComponentThunk,
  loadGroupsFromBackend,
  setGroupToEdit: ComponentSlice.actions.setCurrentGroup,
  saveGroup: saveGroupThunk,
  deleteGroup: deleteGroupThunk,
};

export const ComponentInternalActions = {
  resetCurrentComponent: ComponentSlice.actions.resetCurrentComponent,
};
