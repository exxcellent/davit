import { SequenceStateTO } from "../../dataAccess/access/to/SequenceStateTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { GlobalActions } from "../GlobalSlice";

const saveSequenceStateThunk = (sequenceState: SequenceStateTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceStateTO> = DataAccess.saveSequenceState(sequenceState);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const deleteSequenceStateThunk = (sequenceState: SequenceStateTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceStateTO> = DataAccess.deleteSequenceState(sequenceState);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

export const EditSequenceState = {
    save: saveSequenceStateThunk,
    delete: deleteSequenceStateThunk,
};
