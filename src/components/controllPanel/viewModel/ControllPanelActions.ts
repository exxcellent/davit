import { AppThunk } from "../../../app/store";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { DataConnectionTO } from "../../../dataAccess/access/to/DataConnectionTO";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";
import { DataAccess } from "../../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../../dataAccess/DataAccessResponse";
import {
  globalSlice,
  handleError,
  Mode,
  setModeWithStorage,
} from "../../common/viewModel/GlobalSlice";
import { metaComponentModelSlice } from "../../metaComponentModel/viewModel/MetaComponentModelSlice";
import { metaDataModelSlice } from "../../metaDataModel/viewModel/MetaDataModelSlice";
import { ControllPanelSlice } from "./ControllPanelSlice";

const {
  loadSequences,
  pickComponentToEdit,
  pickDataToEdit,
} = ControllPanelSlice.actions;
const { setSequence } = globalSlice.actions;
const { nextStep } = globalSlice.actions;
const { previousStep } = globalSlice.actions;
const { clearErrors } = globalSlice.actions;
const { loadComponents } = metaComponentModelSlice.actions;
const { loadDatas } = metaDataModelSlice.actions;
const { loadDataConnections } = metaDataModelSlice.actions;

const findAllSequences = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<
    SequenceTO[]
  > = await DataAccess.findAllSequences();
  if (response.code === 200) {
    dispatch(loadSequences(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const findSequence = (sequenceId: number): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceCTO> = await DataAccess.findSequence(
    sequenceId
  );
  if (response.code === 200) {
    dispatch(setSequence(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const findAllComponents = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<
    ComponentCTO[]
  > = await DataAccess.findAllComponents();
  if (response.code === 200) {
    dispatch(loadComponents(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const findAllDatas = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<
    DataCTO[]
  > = await DataAccess.findAllDatas();
  if (response.code === 200) {
    dispatch(loadDatas(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const findAllConnections = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<
    DataConnectionTO[]
  > = await DataAccess.findAllDataConnections();
  if (response.code === 200) {
    dispatch(loadDataConnections(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const saveComponent = (component: ComponentCTO): AppThunk => async (
  dispatch
) => {
  const response: DataAccessResponse<ComponentCTO> = await DataAccess.saveComponentCTO(
    component
  );
  console.log(response);
  if (response.code === 200) {
    dispatch(findAllComponents());
  } else {
    dispatch(handleError(response.message));
  }
};

const saveData = (data: DataCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO> = await DataAccess.saveDataCTO(
    data
  );
  console.log(response);
  if (response.code === 200) {
    dispatch(findAllDatas());
  } else {
    dispatch(handleError(response.message));
  }
};

const saveDataConnection = (
  dataConnection: DataConnectionTO
): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataConnectionTO> = await DataAccess.saveDataConnection(
    dataConnection
  );
  console.log(response);
  if (response.code === 200) {
    dispatch(findAllConnections());
  } else {
    dispatch(handleError(response.message));
  }
};

const storefileData = (fileData: string): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<void> = await DataAccess.storeFileData(
    fileData
  );
  if (response.code === 200) {
    console.log("load components after fileread");
    dispatch(findAllComponents());
    // TODO: workaround, es gibt bestimmt eine bessere Lösung.
    window.location.reload(true);
  } else {
    dispatch(handleError(response.message));
  }
};

const setComponentToEdit = (component: ComponentCTO | null): AppThunk => async (
  dispatch
) => {
  dispatch(pickComponentToEdit(component));
  dispatch(setModeWithStorage(Mode.EDIT_COMPONENT));
};

const setDataToEdit = (data: DataCTO | null): AppThunk => async (dispatch) => {
  dispatch(pickDataToEdit(data));
  dispatch(setModeWithStorage(Mode.EDIT_DATA));
};

export const ControllPanelActions = {
  findAllSequences,
  findSequence,
  nextStep,
  previousStep,
  clearErrors,
  saveComponent,
  storefileData,
  saveData,
  setMode: setModeWithStorage,
  setComponentToEdit,
  setDataToEdit,
  saveDataConnection,
};
