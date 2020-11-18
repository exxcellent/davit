import { DecisionTO } from '../access/to/DecisionTO';
import dataStore from '../DataStore';
import { CheckHelper } from '../util/CheckHelper';
import { DataAccessUtil } from '../util/DataAccessUtil';

export const DecisionRepository = {
    find(id: number): DecisionTO | undefined {
        return dataStore.getDataStore().decisions.get(id);
    },

    findAll(): DecisionTO[] {
        return Array.from(dataStore.getDataStore().decisions.values());
    },

    findAllForSequence(id: number): DecisionTO[] {
        return this.findAll().filter((cond) => cond.sequenceFk === id);
    },

    save(decision: DecisionTO): DecisionTO {
        CheckHelper.nullCheck(decision, 'decision');
        let decisionTO: DecisionTO;
        if (decision.id === -1) {
            decisionTO = {
                ...decision,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            decisionTO = { ...decision };
        }
        dataStore.getDataStore().decisions.set(decisionTO.id, decisionTO);
        return decisionTO;
    },

    delete(decision: DecisionTO) {
        const sucess: boolean = dataStore.getDataStore().decisions.delete(decision.id);
        if (!sucess) {
            throw Error('could not delete decision with id: ' + decision.id);
        } else {
            return decision;
        }
    },
};
