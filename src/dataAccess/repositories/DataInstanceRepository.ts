import { DataInstanceTO } from "../access/to/DataInstanceTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const DataInstanceRepository = {
  find(id: number): DataInstanceTO | undefined {
    return dataStore.getDataStore().instances.get(id);
  },
  findAll(): DataInstanceTO[] {
    return Array.from(dataStore.getDataStore().instances.values());
  },

  findAllDataInstances(dataId: number): DataInstanceTO[] {
    return Array.from(dataStore.getDataStore().instances.values()).filter((instance) => instance.dataFk === dataId);
  },

  save(instance: DataInstanceTO): DataInstanceTO {
    CheckHelper.nullCheck(instance, "instance");
    let dataInstanceTO: DataInstanceTO;
    if (instance.id === -1) {
      dataInstanceTO = {
        ...instance,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
    } else {
      dataInstanceTO = { ...instance };
    }
    dataStore.getDataStore().instances.set(dataInstanceTO.id!, dataInstanceTO);
    return dataInstanceTO;
  },

  delete(instance: DataInstanceTO): DataInstanceTO {
    // TODO: add constraint!
    // ConstraintsHelper.deleteDataConstraintCheck(dataTO.id, dataStore.getDataStore());
    let success = dataStore.getDataStore().instances.delete(instance.id!);
    if (!success) {
      throw new Error("dataAccess.repository.error.notExists");
    }
    return instance;
  },
};
