import { ChainStepTO } from "../access/to/ChainStepTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ChainStepRepository = {
  find(id: number): ChainStepTO | undefined {
    return dataStore.getDataStore().chainsteps.get(id);
  },

  findAll(): ChainStepTO[] {
    return Array.from(dataStore.getDataStore().chainsteps.values());
  },

  findAllForChain(chainId: number) {
    return this.findAll().filter((step) => step.chainFk === chainId);
  },

  delete(step: ChainStepTO) {
    // ConstraintsHelper.deleteStepConstraintCheck(step.id, dataStore.getDataStore());
    let success = dataStore.getDataStore().chainsteps.delete(step.id);
    if (!success) {
      throw new Error("dataAccess.repository.error.notExists");
    }
    return step;
  },

  save(chainStep: ChainStepTO): ChainStepTO {
    CheckHelper.nullCheck(chainStep, "chainstep");
    let chainStepTO: ChainStepTO;
    if (chainStep.id === -1) {
      chainStepTO = {
        ...chainStep,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
    } else {
      chainStepTO = { ...chainStep };
    }
    dataStore.getDataStore().chainsteps.set(chainStepTO.id!, chainStepTO);
    return chainStepTO;
  },
};
