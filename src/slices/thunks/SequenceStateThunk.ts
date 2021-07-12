import { SequenceStateTO } from "../../dataAccess/access/to/SequenceStateTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { DavitUtil } from "../../utils/DavitUtil";
import { GlobalActions } from "../GlobalSlice";

const saveSequenceStateThunk = (sequenceState: SequenceStateTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceStateTO> = DataAccess.saveSequenceState(sequenceState);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const deleteSequenceStateThunk = (stateId: number): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceStateTO> = DataAccess.deleteSequenceState(stateId);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const getStatesBySequenceFk = (sequenceFk: number): SequenceStateTO[] => {
    const response: DataAccessResponse<SequenceStateTO[]> = DataAccess.findAllSequenceStatesBySequenceFk(sequenceFk);
    return DavitUtil.deepCopy(response.object);
};

export const EditSequenceState = {
    save: saveSequenceStateThunk,
    delete: deleteSequenceStateThunk,
    findBySequenceFk: getStatesBySequenceFk,
};
