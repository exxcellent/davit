import { AppThunk } from "../../../app/store";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { ComponentDataCTO } from "../../../dataAccess/access/cto/ComponentDataCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { DataAccess } from "../../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../../dataAccess/DataAccessResponse";
import { handleError, Mode, setModeWithStorage } from "../../../slices/GlobalSlice";
import { ControllPanelSlice } from "./ControllPanelSlice";

const {
  loadSequences,
  pickComponentToEdit,
  pickDataToEdit,
  pickDataRelationToEdit,
  pickSequenceToEdit,
  pickSequenceStepToEdit,
  pickComponentDatasToEdit,
} = ControllPanelSlice.actions;

const findAllSequences = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceCTO[]> = await DataAccess.findAllSequences();
  if (response.code === 200) {
    dispatch(loadSequences(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const findSequence = (sequenceId: number): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceCTO> = await DataAccess.findSequence(sequenceId);
  if (response.code === 200) {
    dispatch(setSequenceToEdit(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const saveSequence = (sequence: SequenceCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceCTO> = await DataAccess.saveSequenceCTO(sequence);
  console.log(response);
  if (response.code === 200) {
    dispatch(findAllSequences());
  } else {
    dispatch(handleError(response.message));
  }
};

const saveSequenceStep = (sequenceStepCTO: SequenceStepCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceStepCTO> = await DataAccess.saveSequenceStepCTO(sequenceStepCTO);
  console.log(response);
  if (response.code === 200) {
    dispatch(findAllSequences());
  } else {
    dispatch(handleError(response.message));
  }
};

const storefileData = (fileData: string): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<void> = await DataAccess.storeFileData(fileData);
  if (response.code === 200) {
    console.log("load components after fileread");
    // dispatch(findAllComponents());
    // TODO: workaround, es gibt bestimmt eine bessere Lösung.
    window.location.reload(true);
  } else {
    dispatch(handleError(response.message));
  }
};

const cancelEditData = (): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT));
  dispatch(setDataToEdit(null));
};

const cancelEditComponent = (): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT));
  dispatch(setComponentToEdit(null));
};

const cancelEditDataRelation = (): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT));
  dispatch(setDataRelationToEdit(null));
};

const cancelEditSequence = (): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT));
  dispatch(setSequenceToEdit(null));
};

const cancelEditStep = (): AppThunk => async (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE));
  dispatch(setSequenceStepToEdit(null));
};

const setComponentToEdit = (component: ComponentCTO | null): AppThunk => async (dispatch) => {
  dispatch(pickComponentToEdit(component));
  dispatch(setModeWithStorage(Mode.EDIT_COMPONENT));
};

const setDataToEdit = (data: DataCTO | null): AppThunk => async (dispatch) => {
  dispatch(pickDataToEdit(data));
  dispatch(setModeWithStorage(Mode.EDIT_DATA));
};

const setDataRelationToEdit = (dataRelation: DataRelationCTO | null): AppThunk => async (dispatch) => {
  dispatch(pickDataRelationToEdit(dataRelation));
  dispatch(setModeWithStorage(Mode.EDIT_DATA_RELATION));
};

const setSequenceToEdit = (sequence: SequenceCTO | null): AppThunk => async (dispatch) => {
  dispatch(pickSequenceToEdit(sequence));
};

const setSequenceStepToEdit = (sequenceStep: SequenceStepCTO | null): AppThunk => async (dispatch) => {
  dispatch(pickSequenceStepToEdit(sequenceStep));
};

const setComponentDatasToEdit = (componentDatas: ComponentDataCTO[] | null): AppThunk => async (dispatch) => {
  dispatch(pickComponentDatasToEdit(componentDatas));
};

export const ControllPanelActions = {
  findAllSequences,
  findSequence,
  storefileData,
  setMode: setModeWithStorage,
  setComponentToEdit,
  setDataToEdit,
  setDataRelationToEdit,
  cancelEditData,
  cancelEditComponent,
  cancelEditDataRelation,
  setSequenceToEdit,
  cancelEditSequence,
  saveSequence,
  setSequenceStepToEdit,
  cancelEditStep,
  saveSequenceStep,
  setComponentDatasToEdit,
};
