import {ChainDecisionTO} from '../access/to/ChainDecisionTO';
import dataStore from '../DataStore';
import {CheckHelper} from '../util/CheckHelper';
import {DataAccessUtil} from '../util/DataAccessUtil';

export const ChainDecisionRepository = {
  find(id: number): ChainDecisionTO | undefined {
    return dataStore.getDataStore().chaindecisions.get(id);
  },

  findAll(): ChainDecisionTO[] {
    return Array.from(dataStore.getDataStore().chaindecisions.values());
  },

  findAllForChain(id: number): ChainDecisionTO[] {
    const all: ChainDecisionTO[] = this.findAll();
    const filtered: ChainDecisionTO[] = all.filter((dec) => dec.chainFk === id);
    return filtered;
  },

  delete(decision: ChainDecisionTO) {
    // ConstraintsHelper.deleteStepConstraintCheck(step.id, dataStore.getDataStore());
    const success = dataStore.getDataStore().chaindecisions.delete(decision.id);
    if (!success) {
      throw new Error('dataAccess.repository.error.notExists');
    }
    return decision;
  },

  save(decision: ChainDecisionTO): ChainDecisionTO {
    CheckHelper.nullCheck(decision, 'decision');
    let chaindecisionTO: ChainDecisionTO;
    if (decision.id === -1) {
      chaindecisionTO = {
        ...decision,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
    } else {
      chaindecisionTO = {...decision};
    }
    dataStore.getDataStore().chaindecisions.set(chaindecisionTO.id!, chaindecisionTO);
    return chaindecisionTO;
  },
};
