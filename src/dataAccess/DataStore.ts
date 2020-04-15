import { DataStoreCTO } from "./DataStoreCTO";
import ComponentTO from "./ComponentTO";
import PositionTO from "./PositionTO";
import DesignTO from "./DesignTO";
import GeometricalDataTO from "./GeometricalDataTO";

class DataStore {
  static instance: DataStore;

  private data: DataStoreCTO = {
    components: new Map<number, ComponentTO>(),
    positions: new Map<number, PositionTO>(),
    designs: new Map<number, DesignTO>(),
    geometricalData: new Map<number, GeometricalDataTO>(),
  };

  public constructor() {
    if (DataStore.instance) {
      return DataStore.instance;
    }
    DataStore.instance = this;
  }

  public getData(): DataStoreCTO {
    return this.data;
  }
}
const dataStore = new DataStore();

export default dataStore;
