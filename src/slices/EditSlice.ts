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
import { handleError } from "./GlobalSlice";
import { MasterDataActions } from "./MasterDataSlice";
import { SequenceModelActions } from "./SequenceModelSlice";

export enum Mode {
  FILE = "FILE",
  VIEW = "VIEW",
  EDIT = "EDIT",
  EDIT_COMPONENT = "EDIT_COMPONENT",
  EDIT_GROUP = "EDIT_GROUP",
  EDIT_DATA = "EDIT_DATA",
  EDIT_DATA_RELATION = "EDIT_DATA_RELATION",
  EDIT_DATA_SETUP = "EDIT_DATA_SETUP",
  EDIT_SEQUENCE = "EDIT_SEQUENCE",
  EDIT_SEQUENCE_STEP = "EDIT_SEQUENCE_STEP",
  EDIT_SEQUENCE_STEP_ACTION = "EDIT_SEQUENCE_STEP_ACTION",
}

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
    | SequenceTO
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
    setSequenceToEdit: (state, action: PayloadAction<SequenceTO>) => {
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

const setModeToFile = (): AppThunk => async (dispatch) => {
  dispatch(EditSlice.actions.clearObjectToEdit());
  dispatch(setModeWithStorage(Mode.FILE));
};

const setModeToView = (): AppThunk => async (dispatch) => {
  dispatch(EditSlice.actions.clearObjectToEdit());
  dispatch(setModeWithStorage(Mode.VIEW));
};

const setModeToEdit = (): AppThunk => async (dispatch) => {
  // TODO: dosn't fells right to do this here!
  dispatch(SequenceModelActions.resetCurrentSequence);
  dispatch(EditSlice.actions.clearObjectToEdit());
  dispatch(setModeWithStorage(Mode.EDIT));
};

const setModeToEditComponent = (component?: ComponentCTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_COMPONENT));
  if (component === undefined) {
    dispatch(EditActions.component.create());
  } else {
    dispatch(EditSlice.actions.setComponentToEdit(component));
  }
};

const setModeToEditData = (data?: DataCTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA));
  if (data === undefined) {
    dispatch(EditActions.data.create());
  } else {
    dispatch(EditSlice.actions.setDataToEdit(data));
  }
};

const setModeToEditRelation = (relation?: DataRelationTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA_RELATION));
  if (relation === undefined) {
    dispatch(EditActions.relation.create());
  } else {
    dispatch(EditSlice.actions.setRelationToEdit(relation));
  }
};

const setModeToEditSequence = (sequenceId?: number): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE));
  if (sequenceId) {
    // TODO: change CTO to TO.
    let response: DataAccessResponse<SequenceCTO> = DataAccess.findSequenceCTO(sequenceId);
    if (response.code === 200) {
      dispatch(EditSlice.actions.setSequenceToEdit(Carv2Util.deepCopy(response.object.sequenceTO)));
      console.log("call setCurrent Sequence: ", sequenceId);
      dispatch(SequenceModelActions.setCurrentSequence(sequenceId));
    } else {
      handleError(response.message);
    }
  } else {
    dispatch(EditActions.sequence.create());
  }
};

const setModeToEditStep = (stepCTO: SequenceStepCTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_STEP));
  dispatch(EditActions.step.create(stepCTO));
};

const setModeToEditAction = (action?: ActionTO): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_STEP_ACTION));
  dispatch(EditSlice.actions.setActionToEdit(action || new ActionTO()));
};

const setModeToEditGroup = (group?: GroupTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_GROUP));
  if (group === undefined) {
    dispatch(EditActions.group.create());
  } else {
    dispatch(EditSlice.actions.setGroupToEdit(group));
  }
};

const setModeToEditDataSetup = (dataSetup?: DataSetupTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA_SETUP));
  if (dataSetup) {
    let response: DataAccessResponse<DataSetupCTO> = DataAccess.findDataSetupCTO(dataSetup.id);
    if (response.code === 200) {
      dispatch(EditSlice.actions.setDataSetupToEdit(Carv2Util.deepCopy(response.object)));
    } else {
      handleError(response.message);
    }
  } else {
    dispatch(EditActions.dataSetup.create());
  }
};

// ----------------------------------------------- COMPONENT -----------------------------------------------

const createComponentThunk = (): AppThunk => (dispatch) => {
  let component: ComponentCTO = new ComponentCTO();
  component.component.name = "neu";
  const response: DataAccessResponse<ComponentCTO> = DataAccess.saveComponentCTO(component);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadComponentsFromBackend());
  dispatch(EditActions.component.update(response.object));
};

const saveComponentThunk = (component: ComponentCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ComponentCTO> = DataAccess.saveComponentCTO(component);
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

const createGroupThunk = (): AppThunk => (dispatch) => {
  let group: GroupTO = new GroupTO();
  const response: DataAccessResponse<GroupTO> = DataAccess.saveGroup(group);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadGroupsFromBackend());
  dispatch(EditActions.group.update(response.object));
};

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

const createDataThunk = (): AppThunk => (dispatch) => {
  let data: DataCTO = new DataCTO();
  const response: DataAccessResponse<DataCTO> = DataAccess.saveDataCTO(data);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDatasFromBackend());
  dispatch(EditActions.data.update(response.object));
};

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

const createRelationThunk = (): AppThunk => (dispatch) => {
  let relation: DataRelationTO = new DataRelationTO();
  const response: DataAccessResponse<DataRelationTO> = DataAccess.saveDataRelationCTO(relation);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadRelationsFromBackend());
  dispatch(EditActions.relation.update(response.object));
};

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

const createDataSetupThunk = (): AppThunk => (dispatch) => {
  let dataSetup: DataSetupCTO = new DataSetupCTO();
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.saveDataSetupCTO(dataSetup);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDataSetupsFromBackend());
  dispatch(EditActions.dataSetup.update(response.object));
};

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

const createSequenceThunk = (): AppThunk => (dispatch) => {
  let sequence: SequenceTO = new SequenceTO();
  const response: DataAccessResponse<SequenceTO> = DataAccess.saveSequenceTO(sequence);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
  dispatch(EditActions.sequence.update(response.object));
};

const saveSequenceThunk = (sequence: SequenceTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceTO> = DataAccess.saveSequenceTO(sequence);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
  dispatch(EditSlice.actions.setSequenceToEdit(response.object));
};

const deleteSequenceThunk = (sequence: SequenceTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceTO> = await DataAccess.deleteSequenceTO(sequence);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

const getSequenceCTOById = (sequenceId: number): SequenceCTO | null => {
  const response: DataAccessResponse<SequenceCTO> = DataAccess.findSequenceCTO(sequenceId);
  if (response.code !== 200) {
    return null;
  }
  return response.object;
};

// ----------------------------------------------- SEQUENCE STEP -----------------------------------------------
const createSequenceStepThunk = (step: SequenceStepCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceStepCTO> = DataAccess.saveSequenceStepCTO(step);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  } else {
    dispatch(EditActions.step.update(response.object));
  }
};

const deleteSequenceStepThunk = (step: SequenceStepCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceStepCTO> = await DataAccess.deleteSequenceStepCTO(step);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

const saveSequenceStepThunk = (step: SequenceStepCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceStepCTO> = await DataAccess.saveSequenceStepCTO(step);
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
  sequenceToEdit: (state: RootState): SequenceTO | null => {
    return state.edit.mode === Mode.EDIT_SEQUENCE && (state.edit.objectToEdit as SequenceTO)
      ? (state.edit.objectToEdit as SequenceTO)
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
    file: setModeToFile,
  },
  component: {
    save: saveComponentThunk,
    delete: deleteComponentThunk,
    update: EditSlice.actions.setComponentToEdit,
    create: createComponentThunk,
  },
  data: {
    save: saveDataThunk,
    delete: deleteDataThunk,
    update: EditSlice.actions.setDataToEdit,
    create: createDataThunk,
  },
  group: {
    save: saveGroupThunk,
    delete: deleteGroupThunk,
    update: EditSlice.actions.setGroupToEdit,
    create: createGroupThunk,
  },
  relation: {
    save: saveRelationThunk,
    delete: deleteRelationThunk,
    create: createRelationThunk,
    update: EditSlice.actions.setRelationToEdit,
  },
  sequence: {
    save: saveSequenceThunk,
    delete: deleteSequenceThunk,
    update: EditSlice.actions.setSequenceToEdit,
    findCTO: getSequenceCTOById,
    create: createSequenceThunk,
  },
  dataSetup: {
    save: saveDataSetupThunk,
    delete: deleteDataSetupThunk,
    update: EditSlice.actions.setDataSetupToEdit,
    create: createDataSetupThunk,
  },
  step: {
    save: saveSequenceStepThunk,
    delete: deleteSequenceStepThunk,
    update: EditSlice.actions.setStepToEdit,
    create: createSequenceStepThunk,
  },
  action: {
    delete: deleteActionThunk,
    update: EditSlice.actions.setActionToEdit,
  },
};
