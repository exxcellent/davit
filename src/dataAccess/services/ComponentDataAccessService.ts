import { ComponentCTO } from "../access/cto/ComponentCTO";
import { GeometricalDataCTO } from "../access/cto/GeometraicalDataCTO";
import { ComponentTO } from "../access/to/ComponentTO";
import { DesignTO } from "../access/to/DesignTO";
import { ComponentRepository } from "../repositories/ComponentRepository";
import { CheckHelper } from "../util/CheckHelper";
import { TechnicalDataAccessService } from "./TechnicalDataAccessService";

export const ComponentDataAccessService = {
  findAll(): ComponentCTO[] {
    return ComponentRepository.findAll().map((component) =>
      createComponentCTO(component)
    );
  },

  findCTO(id: number): ComponentCTO {
    return createComponentCTO(ComponentRepository.find(id));
  },

  find(id: number): ComponentTO | undefined {
    return ComponentRepository.find(id);
  },

  delete(component: ComponentCTO): ComponentCTO {
    console.info("DataAccessService delete called.");
    CheckHelper.nullCheck(component.geometricalData, "GeometricalDataCTO");
    CheckHelper.nullCheck(component.design, "DesignTO");
    CheckHelper.nullCheck(component.component, "ComponentTO");
    TechnicalDataAccessService.deleteGeometricalDataCTO(
      component.geometricalData
    );
    TechnicalDataAccessService.deleteDesign(component.design);
    ComponentRepository.delete(component.component);
    return component;
  },

  saveCTO(componentCTO: ComponentCTO): ComponentCTO {
    CheckHelper.nullCheck(componentCTO, "ComponentCTO");
    const savedDesign = TechnicalDataAccessService.saveDesign(
      componentCTO.design
    );
    componentCTO.component.designFk = savedDesign.id;
    const savedGeometricalData = TechnicalDataAccessService.saveGeometricalData(
      componentCTO.geometricalData
    );
    componentCTO.component.geometricalDataFk =
      savedGeometricalData.geometricalData.id;
    const savedComponent = ComponentRepository.save(componentCTO.component);
    return {
      component: savedComponent,
      geometricalData: savedGeometricalData,
      design: savedDesign,
    };
  },
};

const createComponentCTO = (
  component: ComponentTO | undefined
): ComponentCTO => {
  CheckHelper.nullCheck(component, "component");
  let design: DesignTO | undefined = TechnicalDataAccessService.findDesign(
    component!.designFk!
  );
  CheckHelper.nullCheck(design, "design");
  let geometricalData:
    | GeometricalDataCTO
    | undefined = TechnicalDataAccessService.findGeometricalDataCTO(
    component!.geometricalDataFk!
  );
  CheckHelper.nullCheck(geometricalData, "geometricalData");
  return {
    component: component!,
    geometricalData: geometricalData!,
    design: design!,
  };
};
