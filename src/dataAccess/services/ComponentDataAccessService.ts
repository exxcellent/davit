import { ComponentCTO } from "../ComponentCTO";
import ComponentTO from "../ComponentTO";
import DesignTO from "../DesignTO";
import GeometricalDataTO from "../GeometricalDataTO";
import PositionTO from "../PositionTO";
import dataStore from "../DataStore";
import { ComponentRepository } from "../repositories/ComponentRepository";
import { DesignRepository } from "../repositories/DesignRepository";
import { PositionRepository } from "../repositories/PositionRepository";
import { GeometricalDataRepository } from "../repositories/GeometricalDataRepository";
import { CheckHelper } from "../util/CheckHelper";

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

  static findPosition(id: number): PositionTO | undefined {
    return PositionRepository.find(id);
  }

  static findGeometricalData(id: number): GeometricalDataTO | undefined {
    return GeometricalDataRepository.find(id);
  }

  static findDesign(id: number): DesignTO | undefined {
    return DesignRepository.find(id);
  }

  static delete(component: ComponentCTO): ComponentCTO {
    CheckHelper.nullCheck(component.position, "PositionTO");
    CheckHelper.nullCheck(component.geometricalData, "GeometricalDataTO");
    CheckHelper.nullCheck(component.design, "DesignTO");
    CheckHelper.nullCheck(component.component, "ComponentTO");
    PositionRepository.delete(component.position);
    GeometricalDataRepository.delete(component.geometricalData);
    DesignRepository.delete(component.design);
    ComponentRepository.delete(component.component);
    return component;
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
  CheckHelper.nullCheck(component, "component");
  let design: DesignTO | undefined = dataStore
    .getDataStore()
    .designs.get(component!.designFk);
  CheckHelper.nullCheck(design, "design");
  let geometricalData:
    | GeometricalDataTO
    | undefined = dataStore
    .getDataStore()
    .geometricalData.get(component!.geometricalDataFk);
  CheckHelper.nullCheck(geometricalData, "geometricalData");
  let position: PositionTO | undefined = dataStore
    .getDataStore()
    .positions.get(geometricalData!.positionFk);
  CheckHelper.nullCheck(position, "position");
  return {
    component: component!,
    geometricalData: geometricalData!,
    position: position!,
    design: design!,
  };
};
