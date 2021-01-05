import { AppThunk } from '../../app/store';
import { ChainDecisionTO } from '../../dataAccess/access/to/ChainDecisionTO';
import { ChainlinkTO } from '../../dataAccess/access/to/ChainlinkTO';
import { GoToTypesChain } from '../../dataAccess/access/types/GoToTypeChain';
import { DataAccess } from '../../dataAccess/DataAccess';
import { DataAccessResponse } from '../../dataAccess/DataAccessResponse';
import { editActions, Mode } from '../EditSlice';
import { handleError } from '../GlobalSlice';
import { MasterDataActions } from '../MasterDataSlice';
import { EditChainLink } from './ChainLinkThunks';

const createChainDecisionThunk = (
    decision: ChainDecisionTO,
    from?: ChainDecisionTO | ChainlinkTO,
    ifGoTO?: boolean,
): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.saveChaindecision(decision);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    } else {
        if (from !== undefined) {
            if ((from as ChainlinkTO).dataSetupFk !== undefined) {
                (from as ChainlinkTO).goto = { type: GoToTypesChain.DEC, id: response.object.id };
                dispatch(EditChainLink.save(from as ChainlinkTO));
            }
            if ((from as ChainDecisionTO).elseGoTo !== undefined) {
                if (ifGoTO) {
                    (from as ChainDecisionTO).ifGoTo = { type: GoToTypesChain.DEC, id: response.object.id };
                } else {
                    (from as ChainDecisionTO).elseGoTo = { type: GoToTypesChain.DEC, id: response.object.id };
                }
                dispatch(saveChainDecisionThunk(from as ChainDecisionTO));
            }
        }
        dispatch(setChainDecisionToEditThunk(response.object));
    }
};

const saveChainDecisionThunk = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.saveChaindecision(decision);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

const deleteChainDecisionThunk = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.deleteChaindecision(decision);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

const findChainDecisionThunk = (id: number): ChainDecisionTO => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.findChainDecision(id);
    if (response.code !== 200) {
        handleError(response.message);
    }
    return response.object;
};

const setChainDecisionToEditThunk = (decision: ChainDecisionTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;

    if (mode === Mode.EDIT_CHAIN_DECISION || mode === Mode.EDIT_CHAIN_DECISION_CONDITION) {
        dispatch(editActions.setChainDecisionToEdit(decision));
    } else {
        handleError('Try to set chain step to edit in mode: ' + mode);
    }
};

export const EditChainDecision = {
    create: createChainDecisionThunk,
    save: saveChainDecisionThunk,
    delete: deleteChainDecisionThunk,
    find: findChainDecisionThunk,
};
