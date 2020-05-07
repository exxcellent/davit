import { AppThunk } from "../../../app/store";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataAccess } from "../../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../../dataAccess/DataAccessResponse";
import { handleError } from "../../common/viewModel/GlobalSlice";
import { metaDataModelSlice } from "./MetaDataModelSlice";

const { loadDatas } = metaDataModelSlice.actions;

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

export const MetaDataActions = {
  loadDatas,
  findAllDatas,
  saveData,
};
