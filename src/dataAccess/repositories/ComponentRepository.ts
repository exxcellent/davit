import { isNullOrUndefined } from "util";
import { ComponentTO } from "../access/to/ComponentTO";
import dataStore from "../DataStore";
import { TechnicalDataAccessService } from "../services/TechnicalDataAccessService";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ComponentRepository = {
  find(id: number): ComponentTO | undefined {
    return dataStore.getDataStore().components.get(id);
  },

  findAll(): ComponentTO[] {
    return Array.from(dataStore.getDataStore().components.values());
  },

  delete(component: ComponentTO): ComponentTO {
    if (
      !isNullOrUndefined(
        TechnicalDataAccessService.findGeometricalData(
          component.geometricalDataFk!
        )
      )
    ) {
      throw new Error("dataAccess.repository.error.hasReference");
    }
    if (
      !isNullOrUndefined(
        TechnicalDataAccessService.findDesign(component.designFk!)
      )
    ) {
      throw new Error("dataAccess.repository.error.hasReference");
    }

    let success = dataStore.getDataStore().components.delete(component.id!);
    if (!success) {
      throw new Error("dataAccess.repository.error.notExists");
    }
    return component;
  },

  save(component: ComponentTO): ComponentTO {
    CheckHelper.nullCheck(component, "component");
    let componentTO: ComponentTO;
    if (component.id === -1) {
      componentTO = {
        ...component,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
      console.info("set new component id: " + componentTO.id);
    } else {
      componentTO = { ...component };
    }
    dataStore.getDataStore().components.set(componentTO.id!, componentTO);
    return componentTO;
  },
};
