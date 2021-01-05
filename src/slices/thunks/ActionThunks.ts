// ----------------------------------------------- ACTION -----------------------------------------------

import { AppThunk } from '../../app/store';
import { ActionTO } from '../../dataAccess/access/to/ActionTO';
import { DataAccess } from '../../dataAccess/DataAccess';
import { DataAccessResponse } from '../../dataAccess/DataAccessResponse';
import { editActions, EditActions, Mode } from '../EditSlice';
import { handleError } from '../GlobalSlice';
import { MasterDataActions } from '../MasterDataSlice';

const createActionThunk = (action: ActionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ActionTO> = DataAccess.saveActionTO(action);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(EditActions.setMode.editAction(response.object));
};

const saveActionThunk = (action: ActionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ActionTO> = DataAccess.saveActionTO(action);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
};

const deleteActionThunk = (action: ActionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ActionTO> = DataAccess.deleteActionCTO(action);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadSequencesFromBackend());
};

const setActionToEditThunk = (action: ActionTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;
    if (mode === Mode.EDIT_SEQUENCE_STEP_ACTION) {
        dispatch(editActions.setActionToEdit(action));
    } else {
        handleError('Try to set action to edit in mode: ' + mode);
    }
};

export const EditAction = {
    delete: deleteActionThunk,
    update: setActionToEditThunk,
    save: saveActionThunk,
    create: createActionThunk,
};