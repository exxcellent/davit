import { AppThunk } from "../../../app/store";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { DataAccess } from "../../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../../dataAccess/DataAccessResponse";
import { handleError } from "../../common/viewModel/GlobalSlice";
import { metaDataModelSlice } from "./MetaDataModelSlice";

const { loadDatas } = metaDataModelSlice.actions;
const { loadDataRelations } = metaDataModelSlice.actions;

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

const findAllRelations = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<
    DataRelationCTO[]
  > = await DataAccess.findAllDataRelations();
  if (response.code === 200) {
    dispatch(loadDataRelations(response.object));
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
  loadDataRelations,
  findAllDatas,
  findAllRelations,
  saveData,
  deleteData,
};
