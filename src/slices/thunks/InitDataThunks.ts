import { InitDataTO } from "../../dataAccess/access/to/InitDataTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const saveInitDataThunk = (initData: InitDataTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<InitDataTO> = DataAccess.saveInitData(initData);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const deleteInitDataThunk = (initDataId: number): AppThunk => (dispatch) => {
    const response: DataAccessResponse<InitDataTO> = DataAccess.deleteInitData(initDataId);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadDataSetupsFromBackend());
};

export const EditInitData = {
    save: saveInitDataThunk,
    delete: deleteInitDataThunk,
};
