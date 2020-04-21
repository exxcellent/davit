import ComponentTO from "../ComponentTO";
import dataStore from "../DataStore";
import { isNullOrUndefined } from "util";
import { ComponentDataAccessService } from "../services/ComponentDataAccessService";
import { useIntl } from "react-intl";

export class ComponentRepository {
  static find(id: number): ComponentTO | undefined {
    return dataStore.getDataStore().components.get(id);
  }

  static findAll(): ComponentTO[] {
    return Array.from(dataStore.getDataStore().components.values());
  }

  static delete(component: ComponentTO): ComponentTO {
    let intl = useIntl();
    if (
      !isNullOrUndefined(
        ComponentDataAccessService.findGeometricalData(
          component.geometricalDataFk
        )
      )
    ) {
      throw new Error(
        intl.formatMessage(
          { id: "dataAccess.repository.error.hasReference" },
          { Fk: component.geometricalDataFk }
        )
      );
    }
    if (
      !isNullOrUndefined(
        ComponentDataAccessService.findDesign(component.designFk)
      )
    ) {
      throw new Error(
        intl.formatMessage(
          { id: "dataAccess.repository.error.hasReference" },
          { Fk: component.designFk }
        )
      );
    }

    let success = dataStore.getDataStore().designs.delete(component.id);
    if (!success) {
      throw new Error(
        intl.formatMessage(
          { id: "dataAccess.repository.error.notExists" },
          { objectId: component.id }
        )
      );
    }
    return component;
  }
}
