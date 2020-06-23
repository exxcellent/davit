import { InitDataTO } from "../access/to/InitDataTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const InitDataRepository = {
  find(initDataId: number): InitDataTO | undefined {
    return dataStore.getDataStore().initDatas.get(initDataId);
  },
  findAll(): InitDataTO[] {
    return Array.from(dataStore.getDataStore().initDatas.values());
  },

  save(initData: InitDataTO) {
    CheckHelper.nullCheck(initData, "data");
    let initDataTO: InitDataTO;
    if (initData.id === -1) {
      initDataTO = {
        ...initData,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
    } else {
      initDataTO = { ...initData };
    }
    dataStore.getDataStore().initDatas.set(initDataTO.id!, initDataTO);
    return initDataTO;
  },

  delete(initDataTO: InitDataTO): InitDataTO {
    let success = dataStore.getDataStore().initDatas.delete(initDataTO.id!);
    if (!success) {
      throw new Error("dataAccess.repository.error.notExists");
    }
    return initDataTO;
  },
};
