// ----------------------------------------------- DECISION -----------------------------------------------

import { AppThunk } from '../../app/store';
import { SequenceCTO } from '../../dataAccess/access/cto/SequenceCTO';
import { SequenceStepCTO } from '../../dataAccess/access/cto/SequenceStepCTO';
import { DecisionTO } from '../../dataAccess/access/to/DecisionTO';
import { GoToTypes } from '../../dataAccess/access/types/GoToType';
import { DataAccess } from '../../dataAccess/DataAccess';
import { DataAccessResponse } from '../../dataAccess/DataAccessResponse';
import { DavitUtil } from '../../utils/DavitUtil';
import { editActions, Mode } from '../EditSlice';
import { handleError } from '../GlobalSlice';
import { MasterDataActions } from '../MasterDataSlice';
import { EditStep } from './StepThunks';

const createDecisionThunk = (decision: DecisionTO, from?: SequenceStepCTO | DecisionTO, ifGoTo?: Boolean): AppThunk => (
    dispatch,
) => {
    const response: DataAccessResponse<DecisionTO> = DataAccess.saveDecision(decision);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    } else {
        if (from) {
            if ((from as SequenceStepCTO).squenceStepTO !== undefined) {
                (from as SequenceStepCTO).squenceStepTO.goto = { type: GoToTypes.DEC, id: response.object.id };
                dispatch(EditStep.save(from as SequenceStepCTO));
            }
            if ((from as DecisionTO).elseGoTo !== undefined) {
                if (ifGoTo) {
                    (from as DecisionTO).ifGoTo = { type: GoToTypes.DEC, id: response.object.id };
                } else {
                    (from as DecisionTO).elseGoTo = { type: GoToTypes.DEC, id: response.object.id };
                }
                dispatch(saveDecisionThunk(from as DecisionTO));
            }
        }
        dispatch(setDecisionToEditThunk(response.object));
    }
};

const saveDecisionThunk = (decision: DecisionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<DecisionTO> = DataAccess.saveDecision(decision);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
};

const deleteDecisionThunk = (decision: DecisionTO, sequenceCTO?: SequenceCTO): AppThunk => (dispatch) => {
    // update forent gotos.
    if (sequenceCTO) {
        const copySequence: SequenceCTO = DavitUtil.deepCopy(sequenceCTO);
        // update steps
        copySequence.sequenceStepCTOs.forEach((step) => {
            if (step.squenceStepTO.goto.type === GoToTypes.DEC && step.squenceStepTO.goto.id === decision.id) {
                step.squenceStepTO.goto = { type: GoToTypes.ERROR };
                dispatch(EditStep.save(step));
            }
        });
        // update decisions
        copySequence.decisions.forEach((cond) => {
            if (cond.ifGoTo.type === GoToTypes.DEC && cond.ifGoTo.id === decision.id) {
                cond.ifGoTo = { type: GoToTypes.ERROR };
                dispatch(saveDecisionThunk(cond));
            }
            if (cond.elseGoTo.type === GoToTypes.DEC && cond.elseGoTo.id === decision.id) {
                cond.elseGoTo = { type: GoToTypes.ERROR };
                dispatch(saveDecisionThunk(cond));
            }
        });
    }
    // delete decision.
    const response: DataAccessResponse<DecisionTO> = DataAccess.deleteDecision(decision);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadSequencesFromBackend());
};

const findDecisionTOThunk = (decisionId: number): DecisionTO => {
    const response: DataAccessResponse<DecisionTO> = DataAccess.findDecision(decisionId);
    if (response.code !== 200) {
        handleError(response.message);
    }
    return DavitUtil.deepCopy(response.object);
};

const setDecisionToEditThunk = (decision: DecisionTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;

    if (mode === Mode.EDIT_SEQUENCE_DECISION || Mode.EDIT_SEQUENCE_DECISION_CONDITION) {
        dispatch(editActions.setDecisionToEdit(decision));
    } else {
        handleError("Try to set decision to edit in mode: " + mode);
    }
};

export const EditDecision = {
    create: createDecisionThunk,
    update: setDecisionToEditThunk,
    save: saveDecisionThunk,
    delete: deleteDecisionThunk,
    find: findDecisionTOThunk,
};
