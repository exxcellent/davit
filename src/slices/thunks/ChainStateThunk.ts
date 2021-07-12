import { ChainStateTO } from "../../dataAccess/access/to/ChainStateTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { DavitUtil } from "../../utils/DavitUtil";
import { GlobalActions } from "../GlobalSlice";

const saveChainStateThunk = (chainState: ChainStateTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainStateTO> = DataAccess.saveChainState(chainState);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const deleteChainStateThunk = (chainStateId: number): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainStateTO> = DataAccess.deleteChainState(chainStateId);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const getStatesByChainFk = (chainFk: number): ChainStateTO[] => {
    const response: DataAccessResponse<ChainStateTO[]> = DataAccess.findAllChainStatesByChainFk(chainFk);
    return DavitUtil.deepCopy(response.object);
};

export const EditChainState = {
    save: saveChainStateThunk,
    delete: deleteChainStateThunk,
    findByChainId: getStatesByChainFk
};
