import { ComponentCTO } from "./ComponentCTO";
import { dataStore } from "../app/store";
import { DataStoreCTO } from "./DataStoreCTO";

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
    return {};
  }

  static delete(id: number): ComponentCTO {
    return {};
  }

  static editOrCreate(componentCTO: ComponentCTO): ComponentCTO {
    return {};
  }
}
