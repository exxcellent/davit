import { AppThunk } from "../../../app/store";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataConnectionTO } from "../../../dataAccess/access/to/DataConnectionTO";
import { DataAccess } from "../../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../../dataAccess/DataAccessResponse";
import { handleError } from "../../common/viewModel/GlobalSlice";
import { metaDataModelSlice } from "./MetaDataModelSlice";

const { loadDatas } = metaDataModelSlice.actions;
const { loadDataConnections } = metaDataModelSlice.actions;

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

const saveData = (dataCTO: DataCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO> = await DataAccess.saveDataCTO(
    dataCTO
  );
  console.log(response);
  if (response.code === 200) {
    dispatch(findAllDatas());
  } else {
    dispatch(handleError(response.message));
  }
};

const deleteData = (data: DataCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO> = await DataAccess.deleteDataCTO(
    data
  );
  console.log(response);
  if (response.code === 200) {
    dispatch(findAllDatas());
  } else {
    dispatch(handleError(response.message));
  }
};

export const MetaDataActions = {
  loadDatas,
  loadDataConnections,
  findAllDatas,
  findAllConnections,
  saveData,
  deleteData,
};
