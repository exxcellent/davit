import { ChainStateTO } from "../../dataAccess/access/to/ChainStateTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { GlobalActions } from "../GlobalSlice";

const saveChainStateThunk = (chainState: ChainStateTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainStateTO> = DataAccess.saveChainState(chainState);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const deleteChainStateThunk = (chainState: ChainStateTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainStateTO> = DataAccess.deleteChainState(chainState);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

export const EditChainState = {
    save: saveChainStateThunk,
    delete: deleteChainStateThunk,
};
