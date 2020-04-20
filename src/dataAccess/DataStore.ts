import { DataStoreCTO } from "./DataStoreCTO";
import ComponentTO from "./ComponentTO";
import PositionTO from "./PositionTO";
import DesignTO from "./DesignTO";
import GeometricalDataTO from "./GeometricalDataTO";
import MockData from "./MockData.json";

class DataStore {
  static instance: DataStore;

  private data: DataStoreCTO | undefined;

  public constructor() {
    if (!DataStore.instance.data) {
      this.readData();
    }
    if (DataStore.instance) {
      return DataStore.instance;
    }
    DataStore.instance = this;
  }

  private readData() {
    this.initializeData();
    MockData.components.forEach((component) => {
      this.data!.components.set(component.id, ComponentTO.fromJSON(component));
    });
    MockData.geometriacalData.forEach((geometrical) => {
      this.data!.geometricalData.set(
        geometrical.id,
        GeometricalDataTO.fromJSON(geometrical)
      );
    });
    MockData.position.forEach((positions) => {
      this.data!.positions.set(positions.id, PositionTO.fromJSON(positions));
    });
    MockData.design.forEach((designs) => {
      this.data!.designs.set(designs.id, DesignTO.fromJSON(designs));
    });
  }

  private initializeData(): void {
    this.data = {
      components: new Map<number, ComponentTO>(),
      positions: new Map<number, PositionTO>(),
      designs: new Map<number, DesignTO>(),
      geometricalData: new Map<number, GeometricalDataTO>(),
    };
  }

  public getDataStore(): DataStoreCTO {
    if (!this.data) {
      this.readData();
    }
    return this.data!;
  }
}
const dataStore = new DataStore();

export default dataStore;
