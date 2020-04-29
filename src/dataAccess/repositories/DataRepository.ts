import { DataTO } from "../access/to/DataTO";
import dataStore from "../DataStore";

export const DataRepository = {
  find(dataId: number): DataTO | undefined {
    return dataStore.getDataStore().datas.get(dataId);
  },
};
