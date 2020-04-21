import dataStore from "../DataStore";
import GeometricalDataTO from "../GeometricalDataTO";
import { ComponentDataAccessService } from "../services/ComponentDataAccessService";
import { isNullOrUndefined } from "util";
import { useIntl } from "react-intl";

export class GeometricalDataRepository {
  static find(id: number): GeometricalDataTO | undefined {
    return dataStore.getDataStore().geometricalData.get(id);
  }

  static findAll(): GeometricalDataTO[] {
    return Array.from(dataStore.getDataStore().geometricalData.values());
  }

  static delete(geometricalData: GeometricalDataTO): boolean {
    let intl = useIntl();
    if (
      !isNullOrUndefined(
        ComponentDataAccessService.findPosition(geometricalData.positionFk)
      )
    ) {
      throw new Error(
        intl.formatMessage(
          { id: "dataAccess.repository.error.hasReference" },
          { Fk: geometricalData.positionFk }
        )
      );
    }
    let success = dataStore
      .getDataStore()
      .geometricalData.delete(geometricalData.id);
    if (!success) {
      throw new Error(
        intl.formatMessage(
          { id: "dataAccess.repository.error.notExists" },
          { objectId: geometricalData.id }
        )
      );
    }
    return success;
  }
}
