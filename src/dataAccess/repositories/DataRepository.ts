import { DataTO } from "../access/to/DataTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const DataRepository = {
  find(dataId: number): DataTO | undefined {
    return dataStore.getDataStore().datas.get(dataId);
  },
  findAll(): DataTO[] {
    return Array.from(dataStore.getDataStore().datas.values());
  },

  save(data: DataTO) {
    CheckHelper.nullCheck(data, "data");
    let dataTO: DataTO;
    if (data.id === -1) {
      dataTO = {
        ...data,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
    } else {
      dataTO = { ...data };
    }
    dataStore.getDataStore().datas.set(dataTO.id!, dataTO);
    return dataTO;
  },

  delete(dataTO: DataTO): DataTO {
    let success = dataStore.getDataStore().datas.delete(dataTO.id!);
    if (!success) {
      throw new Error("dataAccess.repository.error.notExists");
    }
    return dataTO;
  },
};
