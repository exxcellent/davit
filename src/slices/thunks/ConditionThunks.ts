// ----------------------------------------------- DECISION -----------------------------------------------

import { AppThunk } from '../../app/store';
import { ConditionTO } from '../../dataAccess/access/to/ConditionTO';
import { DecisionTO } from '../../dataAccess/access/to/DecisionTO';
import { DavitUtil } from '../../utils/DavitUtil';
import { editActions } from '../EditSlice';
import { EditDecision } from './DecisionThunks';

const saveConditionThunk = (conditionToSave: ConditionTO): AppThunk => (dispatch) => {
    const decisionToSave: DecisionTO = EditDecision.find(conditionToSave.decisionFk);
    const copyDecisionToSave: DecisionTO = DavitUtil.deepCopy(decisionToSave);
    console.info('decision befor save: ', copyDecisionToSave);
    copyDecisionToSave.conditions.forEach((condition) => {
        if (condition.id === conditionToSave.id) {
            condition = conditionToSave;
        }
    });
    console.info('decision to save: ', copyDecisionToSave);
    dispatch(EditDecision.save(copyDecisionToSave));
};

const updateConditionThunk = (condition: ConditionTO): AppThunk => (dispatch) => {
    if (condition) {
        dispatch(editActions.setConditionToEdit(condition));
    }
};

const deleteConditionThunk = (conditionToDelete: ConditionTO): AppThunk => (dispatch) => {
    if (conditionToDelete) {
        const decisionToEdit: DecisionTO = EditDecision.find(conditionToDelete.decisionFk);
        const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
        const filteredConditions: ConditionTO[] = copyDecision.conditions.filter(
            (condition) =>
                condition.actorFk !== conditionToDelete.actorFk && condition.dataFk !== conditionToDelete.dataFk,
        );
        copyDecision.conditions = filteredConditions;
        dispatch(EditDecision.save(copyDecision));
    }
};

export const EditCondition = {
    update: updateConditionThunk,
    save: saveConditionThunk,
    delete: deleteConditionThunk,
};
