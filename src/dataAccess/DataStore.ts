import { DataStoreCTO } from "./access/cto/DataStoreCTO";
import { ComponentDataTO } from "./access/to/ComponentDataTO";
import { ComponentTO } from "./access/to/ComponentTO";
import { DataTO } from "./access/to/DataTO";
import { DesignTO } from "./access/to/DesignTO";
import { GeometricalDataTO } from "./access/to/GeometricalDataTO";
import { PositionTO } from "./access/to/PositionTO";
import { SequenceStepTO } from "./access/to/SequenceStepTO";
import { SequenceTO } from "./access/to/SequenceTO";
import { StoreTO } from "./access/to/StoreTO";

const STORE_ID = "carv2";

class DataStore {
  static instance: DataStore;
  private data: DataStoreCTO | undefined;

  public constructor() {
    if (!DataStore.instance || !DataStore.instance.data) {
      this.readData();
    }
    if (DataStore.instance) {
      return DataStore.instance;
    }
    DataStore.instance = this;
  }

  private readData() {
    this.initializeData();
    const dataObeject: string | null = localStorage.getItem(STORE_ID);
    let objectStore: StoreTO = {} as StoreTO;
    if (!dataObeject) {
      localStorage.setItem(STORE_ID, JSON.stringify({} as StoreTO));
    } else {
      objectStore = JSON.parse(localStorage.getItem(STORE_ID)!);
    }
    console.log("Store: " + objectStore);
    // TODO: auslagern in map function mit AbstractTO!
    if (objectStore.components !== undefined) {
      objectStore.components.forEach((component) => {
        this.data!.components.set(component.id, component);
      });
    }
    if (objectStore.geometricalDatas !== undefined) {
      objectStore.geometricalDatas.forEach((geometrical) => {
        this.data!.geometricalDatas.set(geometrical.id, geometrical);
      });
    }
    if (objectStore.positions !== undefined) {
      objectStore.positions.forEach((positions) => {
        this.data!.positions.set(positions.id, positions);
      });
    }
    if (objectStore.designs !== undefined) {
      objectStore.designs.forEach((designs) => {
        this.data!.designs.set(designs.id, designs);
      });
    }
    if (objectStore.sequences !== undefined) {
      objectStore.sequences.forEach((sequence) => {
        this.data!.sequences.set(sequence.id, sequence);
      });
    }
    if (objectStore.steps !== undefined) {
      objectStore.steps.forEach((step) => {
        this.data!.steps.set(step.id, step);
      });
    }
    if (objectStore.componentDatas !== undefined) {
      objectStore.componentDatas.forEach((componentData) => {
        this.data!.componentDatas.set(componentData.id, componentData);
      });
    }
    if (objectStore.datas !== undefined) {
      objectStore.datas.forEach((data) => {
        this.data!.datas.set(data.id, data);
      });
    }
  }

  private saveData(): void {
    // let s: StoreTO = {} as StoreTO;
    // // ["components"] als Enum, dann über Enum loopen.
    // s["components"] = Array.from(this.data!["components"].values());
    let objectStore: StoreTO = {
      components: Array.from(this.data!.components.values()),
      designs: Array.from(this.data!.designs.values()),
      geometricalDatas: Array.from(this.data!.geometricalDatas.values()),
      positions: Array.from(this.data!.positions.values()),
      sequences: Array.from(this.data!.sequences.values()),
      steps: Array.from(this.data!.steps.values()),
      componentDatas: Array.from(this.data!.componentDatas.values()),
      datas: Array.from(this.data!.datas.values()),
    };
    console.log("New Store data: " + JSON.stringify(objectStore));
    localStorage.setItem(STORE_ID, JSON.stringify(objectStore));
  }

  private initializeData(): void {
    this.data = {
      components: new Map<number, ComponentTO>(),
      positions: new Map<number, PositionTO>(),
      designs: new Map<number, DesignTO>(),
      geometricalDatas: new Map<number, GeometricalDataTO>(),
      sequences: new Map<number, SequenceTO>(),
      steps: new Map<number, SequenceStepTO>(),
      componentDatas: new Map<number, ComponentDataTO>(),
      datas: new Map<number, DataTO>(),
    };
  }

  public commitChanges(): void {
    console.info("Data Store: commit changes.");
    this.saveData();
    this.readData();
  }

  public roleBack(): void {
    console.warn("Data Store: role back.");
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
