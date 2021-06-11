import { SequenceMockTO } from "../../dataAccess/access/to/SequenceMockTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { GlobalActions } from "../GlobalSlice";

const saveSequenceMockThunk = (sequenceMock: SequenceMockTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceMockTO> = DataAccess.saveSequenceMock(sequenceMock);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const deleteSequenceMockThunk = (sequenceMock: SequenceMockTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceMockTO> = DataAccess.deleteSequenceMock(sequenceMock);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

export const EditSequenceMock = {
    save: saveSequenceMockThunk,
    delete: deleteSequenceMockThunk,
};
