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
    MockData.geometricalDatas.forEach((geometrical) => {
      this.data!.geometricalData.set(
        geometrical.id,
        GeometricalDataTO.fromJSON(geometrical)
      );
    });
    MockData.positions.forEach((positions) => {
      this.data!.positions.set(positions.id, PositionTO.fromJSON(positions));
    });
    MockData.designs.forEach((designs) => {
      this.data!.designs.set(designs.id, DesignTO.fromJSON(designs));
    });
  }

  private saveData(): void {
    if (this.data?.components.values() !== undefined) {
      MockData.components = Array.from(this.data.components.values());
    }
    if (this.data?.designs.values() !== undefined) {
      MockData.designs = Array.from(this.data.designs.values());
    }
    if (this.data?.geometricalData.values() !== undefined) {
      MockData.geometricalDatas = Array.from(
        this.data.geometricalData.values()
      );
    }
    if (this.data?.positions.values() !== undefined) {
      MockData.positions = Array.from(this.data.positions.values());
    }
  }

  private initializeData(): void {
    this.data = {
      components: new Map<number, ComponentTO>(),
      positions: new Map<number, PositionTO>(),
      designs: new Map<number, DesignTO>(),
      geometricalData: new Map<number, GeometricalDataTO>(),
    };
  }

  public commitChanges(): void {
    this.saveData();
    this.readData();
  }

  public roleBack(): void {
    this.readData();
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
