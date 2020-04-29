import { isNullOrUndefined } from "util";
import { GeometricalDataTO } from "../access/to/GeometricalDataTO";
import dataStore from "../DataStore";
import { TechnicalDataAccessService } from "../services/TechnicalDataAccessService";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const GeometricalDataRepository = {
  find(id: number): GeometricalDataTO | undefined {
    return dataStore.getDataStore().geometricalData.get(id);
  },

  findAll(): GeometricalDataTO[] {
    return Array.from(dataStore.getDataStore().geometricalData.values());
  },

  delete(geometricalData: GeometricalDataTO): boolean {
    if (
      !isNullOrUndefined(
        TechnicalDataAccessService.findPosition(geometricalData.positionFk!)
      )
    ) {
      throw new Error("dataAccess.repository.error.hasReference");
    }
    let success = dataStore
      .getDataStore()
      .geometricalData.delete(geometricalData.id!);
    if (!success) {
      throw new Error("dataAccess.repository.error.notExists");
    }
    return success;
  },

  save(geometricalData: GeometricalDataTO): GeometricalDataTO {
    let geometricalDataTO: GeometricalDataTO;
    if (geometricalData.id === -1) {
      geometricalDataTO = {
        ...geometricalData,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
    } else {
      geometricalDataTO = { ...geometricalData };
    }
    dataStore
      .getDataStore()
      .geometricalData.set(geometricalDataTO.id!, geometricalDataTO);
    return geometricalDataTO;
  },
};
