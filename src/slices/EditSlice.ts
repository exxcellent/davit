import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { ComponentCTO } from "../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../dataAccess/access/cto/DataCTO";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { DataRelationTO } from "../dataAccess/access/to/DataRelationTO";
import { DataSetupTO } from "../dataAccess/access/to/DataSetupTO";
import { GroupTO } from "../dataAccess/access/to/GroupTO";
import { SequenceTO } from "../dataAccess/access/to/SequenceTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { Carv2Util } from "../utils/Carv2Util";
import { handleError, Mode } from "./GlobalSlice";
import { MasterDataActions } from "./MasterSlice";

const MODE_LOCAL_STORAGE = "MODE";

interface StepAction {
  step: SequenceStepCTO;
  actionTO: ActionTO;
}

interface EditState {
  mode: Mode;
  objectToEdit:
    | ComponentCTO
    | DataCTO
    | DataRelationTO
    | SequenceCTO
    | SequenceStepCTO
    | StepAction
    | DataSetupCTO
    | GroupTO
    | {};
}
const getInitialState: EditState = {
  objectToEdit: {},
  mode: Mode.EDIT,
};

const EditSlice = createSlice({
  name: "edit",
  initialState: getInitialState,
  reducers: {
    setComponentToEdit: (state, action: PayloadAction<ComponentCTO>) => {
      if (state.mode === Mode.EDIT_COMPONENT) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set component to edit in mode: " + state.mode);
      }
    },
    setDataToEdit: (state, action: PayloadAction<DataCTO>) => {
      if (state.mode === Mode.EDIT_DATA) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set data to edit in mode: " + state.mode);
      }
    },
    setRelationToEdit: (state, action: PayloadAction<DataRelationTO>) => {
      if (state.mode === Mode.EDIT_DATA_RELATION) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set relation to edit in mode: " + state.mode);
      }
    },
    setSequenceToEdit: (state, action: PayloadAction<SequenceCTO>) => {
      if (state.mode === Mode.EDIT_SEQUENCE) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set sequence to edit in mode: " + state.mode);
      }
    },
    setStepToEdit: (state, action: PayloadAction<SequenceStepCTO>) => {
      if (state.mode.startsWith(Mode.EDIT_SEQUENCE_STEP)) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set step to edit in mode: " + state.mode);
      }
    },
    setActionToEdit: (state, action: PayloadAction<ActionTO>) => {
      if (state.mode === Mode.EDIT_SEQUENCE_STEP_ACTION) {
        let sequenceStep: SequenceStepCTO;
        if ((state.objectToEdit as SequenceStepCTO).squenceStepTO) {
          sequenceStep = state.objectToEdit as SequenceStepCTO;
        } else {
          sequenceStep = (state.objectToEdit as StepAction).step;
        }
        state.objectToEdit = { step: sequenceStep, actionTO: action.payload };
      } else {
        handleError("Try to set action to edit in mode: " + state.mode);
      }
    },
    setDataSetupToEdit: (state, action: PayloadAction<DataSetupCTO>) => {
      if (state.mode === Mode.EDIT_DATA_SETUP) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set dataSetup to edit in mode: " + state.mode);
      }
    },
    setGroupToEdit: (state, action: PayloadAction<GroupTO>) => {
      if (state.mode === Mode.EDIT_GROUP) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set group to edit in mode: " + state.mode);
      }
    },
    clearObjectToEdit: (state) => {
      state.objectToEdit = {};
    },
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
  },
});

// =============================================== THUNKS ===============================================

// ----------------------------------------------- SET MODE -----------------------------------------------
const setModeWithStorage = (mode: Mode): AppThunk => async (dispatch) => {
  localStorage.setItem(MODE_LOCAL_STORAGE, mode);
  dispatch(EditSlice.actions.setMode(mode));
};

const setModeToView = (): AppThunk => async (dispatch) => {
  dispatch(EditSlice.actions.clearObjectToEdit());
  dispatch(setModeWithStorage(Mode.VIEW));
};

const setModeToEdit = (): AppThunk => async (dispatch) => {
  dispatch(EditSlice.actions.clearObjectToEdit());
  dispatch(setModeWithStorage(Mode.EDIT));
};

const setModeToEditComponent = (component?: ComponentCTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_COMPONENT));
  dispatch(EditSlice.actions.setComponentToEdit(component || new ComponentCTO()));
};

const setModeToEditData = (data?: DataCTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA));
  dispatch(EditSlice.actions.setDataToEdit(data || new DataCTO()));
};

const setModeToEditRelation = (relation?: DataRelationTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA_RELATION));
  dispatch(EditSlice.actions.setRelationToEdit(relation || new DataRelationTO()));
};

const setModeToEditSequence = (sequence?: SequenceTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE));
  if (sequence) {
    let response: DataAccessResponse<SequenceCTO> = DataAccess.findSequence(sequence.id);
    if (response.code === 200) {
      dispatch(EditSlice.actions.setSequenceToEdit(Carv2Util.deepCopy(response.object)));
    } else {
      handleError(response.message);
    }
  } else {
    dispatch(EditSlice.actions.setSequenceToEdit(new SequenceCTO()));
  }
};

const setModeToEditStep = (stepCTO?: SequenceStepCTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_STEP));
  dispatch(EditSlice.actions.setStepToEdit(Carv2Util.deepCopy(stepCTO) || new SequenceStepCTO()));
};

const setModeToEditAction = (action?: ActionTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_STEP_ACTION));
  dispatch(EditSlice.actions.setActionToEdit(action || new ActionTO()));
};

const setModeToEditGroup = (group?: GroupTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_GROUP));
  dispatch(EditSlice.actions.setGroupToEdit(group || new GroupTO()));
};

const setModeToEditDataSetup = (dataSetup?: DataSetupTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA_SETUP));
  if (dataSetup) {
    let response: DataAccessResponse<DataSetupCTO> = DataAccess.findDataSetupCTO(dataSetup.id);
    if (response.code === 200) {
      dispatch(EditSlice.actions.setDataSetupToEdit(Carv2Util.deepCopy(response.object)));
    } else {
      handleError(response.message);
    }
  } else {
    dispatch(EditSlice.actions.setDataSetupToEdit(new DataSetupCTO()));
  }
};

// ----------------------------------------------- COMPONENT -----------------------------------------------
const saveComponentThunk = (component: ComponentCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ComponentCTO> = await DataAccess.saveComponentCTO(component);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadComponentsFromBackend());
};

const deleteComponentThunk = (component: ComponentCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ComponentCTO> = await DataAccess.deleteComponentCTO(component);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadComponentsFromBackend());
};

// ----------------------------------------------- GROUP -----------------------------------------------
const saveGroupThunk = (group: GroupTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<GroupTO> = await DataAccess.saveGroup(group);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadGroupsFromBackend());
};

const deleteGroupThunk = (group: GroupTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<GroupTO> = await DataAccess.deleteGroupTO(group);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadGroupsFromBackend());
  dispatch(MasterDataActions.loadComponentsFromBackend());
};

// ----------------------------------------------- DATA -----------------------------------------------
const saveDataThunk = (data: DataCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO> = await DataAccess.saveDataCTO(data);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDatasFromBackend());
};

const deleteDataThunk = (data: DataCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO> = await DataAccess.deleteDataCTO(data);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDatasFromBackend());
  dispatch(MasterDataActions.loadRelationsFromBackend());
};

// ----------------------------------------------- RELATION -----------------------------------------------
const saveRelationThunk = (relation: DataRelationTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataRelationTO> = await DataAccess.saveDataRelationCTO(relation);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadRelationsFromBackend());
};

const deleteRelationThunk = (relation: DataRelationTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataRelationTO> = await DataAccess.deleteDataRelation(relation);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadRelationsFromBackend());
};

// ----------------------------------------------- DATA SETUP -----------------------------------------------
const saveDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.saveDataSetupCTO(dataSetup);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDataSetupsFromBackend());
};

const deleteDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = await DataAccess.deleteDataSetup(dataSetup);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDataSetupsFromBackend());
};

// ----------------------------------------------- SEQUENCE -----------------------------------------------
const saveSequenceThunk = (sequence: SequenceCTO): AppThunk => (dispatch) => {
  let copySequence: SequenceCTO = Carv2Util.deepCopy(sequence);
  copySequence.sequenceStepCTOs.sort((step1, step2) => step1.squenceStepTO.index - step2.squenceStepTO.index);
  const response: DataAccessResponse<SequenceCTO> = DataAccess.saveSequenceCTO(copySequence);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

const deleteSequenceThunk = (sequence: SequenceCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceCTO> = await DataAccess.deleteSequenceCTO(sequence);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

// ----------------------------------------------- SEQUENCE STEP -----------------------------------------------
const deleteSequenceStepThunk = (step: SequenceStepCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceStepCTO> = await DataAccess.deleteSequenceStepCTO(step);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

const deleteActionThunk = (action: ActionTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ActionTO> = await DataAccess.deleteActionCTO(action);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

// =============================================== SELECTORS ===============================================
export const EditReducer = EditSlice.reducer;
/**
 * To make it easy to select the right obejct to edit we have selectors that ensure that the right object to edit is returned for the mode
 * Since the object to edit is a sumtype we ensure the right type by checking for a unqiue field
 */
export const editSelectors = {
  mode: (state: RootState): Mode => state.edit.mode,
  componentToEdit: (state: RootState): ComponentCTO | null => {
    return state.edit.mode === Mode.EDIT_COMPONENT && (state.edit.objectToEdit as ComponentCTO).component
      ? (state.edit.objectToEdit as ComponentCTO)
      : null;
  },
  dataToEdit: (state: RootState): DataCTO | null => {
    return state.edit.mode === Mode.EDIT_DATA && (state.edit.objectToEdit as DataCTO).data
      ? (state.edit.objectToEdit as DataCTO)
      : null;
  },
  groupToEdit: (state: RootState): GroupTO | null => {
    return state.edit.mode === Mode.EDIT_GROUP && (state.edit.objectToEdit as GroupTO).color
      ? (state.edit.objectToEdit as GroupTO)
      : null;
  },
  relationToEdit: (state: RootState): DataRelationTO | null => {
    return state.edit.mode === Mode.EDIT_DATA_RELATION && (state.edit.objectToEdit as DataRelationTO).direction1
      ? (state.edit.objectToEdit as DataRelationTO)
      : null;
  },
  sequenceToEdit: (state: RootState): SequenceCTO | null => {
    return state.edit.mode === Mode.EDIT_SEQUENCE && (state.edit.objectToEdit as SequenceCTO).sequenceTO
      ? (state.edit.objectToEdit as SequenceCTO)
      : null;
  },
  dataSetupToEdit: (state: RootState): DataSetupCTO | null => {
    return state.edit.mode === Mode.EDIT_DATA_SETUP && (state.edit.objectToEdit as DataSetupCTO).dataSetup
      ? (state.edit.objectToEdit as DataSetupCTO)
      : null;
  },
  stepToEdit: (state: RootState): SequenceStepCTO | null => {
    switch (state.edit.mode) {
      case Mode.EDIT_SEQUENCE_STEP:
        return (state.edit.objectToEdit as SequenceStepCTO).squenceStepTO
          ? (state.edit.objectToEdit as SequenceStepCTO)
          : null;
      case Mode.EDIT_SEQUENCE_STEP_ACTION:
        return (state.edit.objectToEdit as StepAction).step ? (state.edit.objectToEdit as StepAction).step : null;
      default:
        return null;
    }
  },
  actionToEdit: (state: RootState): ActionTO | null => {
    return state.edit.mode === Mode.EDIT_SEQUENCE_STEP_ACTION && (state.edit.objectToEdit as StepAction).actionTO
      ? (state.edit.objectToEdit as StepAction).actionTO
      : null;
  },
};

// =============================================== ACTIONS ===============================================

export const EditActions = {
  setMode: {
    editComponent: setModeToEditComponent,
    editData: setModeToEditData,
    editGroup: setModeToEditGroup,
    editRelation: setModeToEditRelation,
    editSequence: setModeToEditSequence,
    editDataSetup: setModeToEditDataSetup,
    editStep: setModeToEditStep,
    editAction: setModeToEditAction,
    edit: setModeToEdit,
    view: setModeToView,
  },
  component: {
    save: saveComponentThunk,
    delete: deleteComponentThunk,
  },
  data: {
    save: saveDataThunk,
    delete: deleteDataThunk,
  },
  group: {
    save: saveGroupThunk,
    delete: deleteGroupThunk,
  },
  relation: {
    save: saveRelationThunk,
    delete: deleteRelationThunk,
  },
  sequence: {
    save: saveSequenceThunk,
    delete: deleteSequenceThunk,
  },
  dataSetup: {
    save: saveDataSetupThunk,
    delete: deleteDataSetupThunk,
  },
  step: {
    delete: deleteSequenceStepThunk,
  },
  action: {
    delete: deleteActionThunk,
  },
};
