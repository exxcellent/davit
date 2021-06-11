import { ChainMockTO } from "../../dataAccess/access/to/ChainMockTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { GlobalActions } from "../GlobalSlice";

const saveChainMockThunk = (chainMock: ChainMockTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainMockTO> = DataAccess.saveChainMock(chainMock);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const deleteChainMockThunk = (chainMock: ChainMockTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainMockTO> = DataAccess.deleteChainMock(chainMock);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

export const EditChainMock = {
    save: saveChainMockThunk,
    delete: deleteChainMockThunk,
};
