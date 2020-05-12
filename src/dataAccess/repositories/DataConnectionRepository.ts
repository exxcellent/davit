import { DataConnectionTO } from "../access/to/DataConnectionTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const DataConnectionRepository = {
  find(dataConnectionId: number): DataConnectionTO | undefined {
    return dataStore.getDataStore().dataConnections.get(dataConnectionId);
  },
  findAll(): DataConnectionTO[] {
    return Array.from(dataStore.getDataStore().dataConnections.values());
  },
  save(dataConnection: DataConnectionTO) {
    CheckHelper.nullCheck(dataConnection, "dataConnection");
    let dataConnectionTO: DataConnectionTO;
    if (dataConnection.id === -1) {
      dataConnectionTO = {
        ...dataConnection,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
      console.info("set new component id: " + dataConnectionTO.id);
    } else {
      dataConnectionTO = { ...dataConnection };
    }
    dataStore
      .getDataStore()
      .dataConnections.set(dataConnectionTO.id!, dataConnectionTO);
    return dataConnectionTO;
  },
};
