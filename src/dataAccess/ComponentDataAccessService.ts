import { ComponentCTO } from "./ComponentCTO";
import { DataStoreCTO } from "./DataStoreCTO";
import ComponentTO from "./ComponentTO";
import DesignTO from "./DesignTO";
import GeometricalDataTO from "./GeometricalDataTO";
import PositionTO from "./PositionTO";
import dataStore from "./DataStore";
import { ComponentRepository } from "./repositories/ComponentRepository";
import { isNullOrUndefined } from "util";

export class ComponentDataAccessService {
  // static findAll(): ComponentCTO[] {
  //   return components;
  // }

  static find(id: number): ComponentCTO {
    return createComponentCTO(ComponentRepository.find(id));
  }

  static findAll(): ComponentCTO[] {
    return ComponentRepository.findAll().map((component) =>
      createComponentCTO(component)
    );
  }

  static delete(id: number): ComponentCTO {
    return {
      component: ComponentTO.builder().build(),
      design: DesignTO.builder().build(),
      geometricalData: GeometricalDataTO.builder().build(),
      position: PositionTO.builder().build(),
    };
  }

  static editOrCreate(componentCTO: ComponentCTO): ComponentCTO {
    return {
      component: ComponentTO.builder().build(),
      design: DesignTO.builder().build(),
      geometricalData: GeometricalDataTO.builder().build(),
      position: PositionTO.builder().build(),
    };
  }
}

const createComponentCTO = (
  component: ComponentTO | undefined
): ComponentCTO => {
  nullCheck(component, "component");
  let design: DesignTO | undefined = dataStore
    .getDataStore()
    .designs.get(component!.designFk);
  nullCheck(design, "design");
  let geometricalData:
    | GeometricalDataTO
    | undefined = dataStore
    .getDataStore()
    .geometricalData.get(component!.geomatricalDataFk);
  nullCheck(geometricalData, "geometricalData");
  let position: PositionTO | undefined = dataStore
    .getDataStore()
    .positions.get(geometricalData!.positionFk);
  nullCheck(position, "position");
  return {
    component: component!,
    geometricalData: geometricalData!,
    position: position!,
    design: design!,
  };
};

const nullCheck = (object: any, name: string) => {
  if (isNullOrUndefined(object)) {
    throw new Error(`${name} must not be null or undefined`);
  }
};
