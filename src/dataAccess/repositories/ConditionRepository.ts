import { ConditionTO } from "../access/to/ConditionTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ConditionRepository = {
  find(conditionId: number): ConditionTO | undefined {
    return dataStore.getDataStore().conditions.get(conditionId);
  },

  findAll(): ConditionTO[] {
    return Array.from(dataStore.getDataStore().conditions.values());
  },

  save(condition: ConditionTO): ConditionTO {
    CheckHelper.nullCheck(condition, "condition");
    let conditionTO: ConditionTO;
    if (condition.id === -1) {
      conditionTO = {
        ...condition,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
    } else {
      conditionTO = { ...condition };
    }
    dataStore.getDataStore().conditions.set(conditionTO.id, conditionTO);
    return condition;
  },

  delete(condition: ConditionTO) {
    const sucess: boolean = dataStore.getDataStore().conditions.delete(condition.id);
    if (!sucess) {
      throw Error("could not delete condition with id: " + condition.id);
    } else {
      return condition;
    }
  },
};
