import { ComponentCTO } from "./ComponentCTO";
import { DataStoreCTO } from "./DataStoreCTO";
import ComponentTO from "./ComponentTO";
import DesignTO from "./DesignTO";
import GeometricalDataTO from "./GeometricalDataTO";
import PositionTO from "./PositionTO";
import dataStore from "./DataStore";

export class ComponentDataAccessService {
  static findAll(): ComponentCTO[] {
    const data: DataStoreCTO = dataStore.getData();
    const components: ComponentCTO[] = [];
    data.components.forEach((item) =>
      components.push({
        componentTO: item,
        geometricalData: data.geometricalData.get(item.geomatricalDataFk),
        position: data.positions.get(
          data.geometricalData.get(item.geomatricalDataFk)?.positionFk || -1
        ),
        design: data.designs.get(item.designFk),
      })
    );
    return components;
  }

  static find(id: number): ComponentCTO {
    return {
      componentTO: ComponentTO.builder().build(),
      design: DesignTO.builder().build(),
      geometricalData: GeometricalDataTO.builder().build(),
      position: PositionTO.builder().build(),
    };
  }

  static delete(id: number): ComponentCTO {
    return {
      componentTO: ComponentTO.builder().build(),
      design: DesignTO.builder().build(),
      geometricalData: GeometricalDataTO.builder().build(),
      position: PositionTO.builder().build(),
    };
  }

  static editOrCreate(componentCTO: ComponentCTO): ComponentCTO {
    return {
      componentTO: ComponentTO.builder().build(),
      design: DesignTO.builder().build(),
      geometricalData: GeometricalDataTO.builder().build(),
      position: PositionTO.builder().build(),
    };
  }
}
