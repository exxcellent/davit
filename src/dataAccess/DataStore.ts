import { DataStoreCTO } from "./access/cto/DataStoreCTO";
import { StoreTO } from "./access/to/StoreTO";

const STORE_ID = "carv2";

class DataStore {
  static instance: DataStore;
  private data: DataStoreCTO | undefined;

  public constructor() {
    if (!DataStore.instance || !DataStore.instance.data) {
      this.readDataFromStorage();
    }
    if (DataStore.instance) {
      return DataStore.instance;
    }
    DataStore.instance = this;
  }

  private readDataFromStorage() {
    const dataObeject: string | null = localStorage.getItem(STORE_ID);
    let objectStore: StoreTO = {} as StoreTO;
    if (!dataObeject) {
      localStorage.setItem(STORE_ID, JSON.stringify({} as StoreTO));
    } else {
      objectStore = JSON.parse(localStorage.getItem(STORE_ID)!);
    }
    this.readData(objectStore);
  }

  private readData(objectStore: StoreTO) {
    this.data = new DataStoreCTO();
    Object.entries(objectStore).map(([key, value]) => {
      if (value !== undefined) {
        const dataEntry = Object.entries(this.data!).find(([dataKey, dataValue]) => dataKey === key);
        if (dataEntry) {
          value.forEach((abstractTO: any) => {
            dataEntry[1].set(abstractTO.id, abstractTO);
          });
        } else {
          throw new Error(`Data has wrong format: key ${key}, value ${value}`);
        }
      } else {
        throw new Error(`No value found for key ${key}`);
      }
      // nur damit eslint ruhig ist...
      return true;
    });
  }

  private saveData(): void {
    localStorage.setItem(STORE_ID, JSON.stringify(this.getDataStoreObject()));
  }

  private getDataStoreObject(): StoreTO {
    return {
      components: Array.from(this.data!.components.values()),
      groups: Array.from(this.data!.groups.values()),
      designs: Array.from(this.data!.designs.values()),
      geometricalDatas: Array.from(this.data!.geometricalDatas.values()),
      positions: Array.from(this.data!.positions.values()),
      sequences: Array.from(this.data!.sequences.values()),
      steps: Array.from(this.data!.steps.values()),
      actions: Array.from(this.data!.actions.values()),
      datas: Array.from(this.data!.datas.values()),
      instances: Array.from(this.data!.instances.values()),
      dataConnections: Array.from(this.data!.dataConnections.values()),
      initDatas: Array.from(this.data!.initDatas.values()),
      dataSetups: Array.from(this.data!.dataSetups.values()),
      decisions: Array.from(this.data!.decisions.values()),
      chains: Array.from(this.data!.chains.values()),
      chainlinks: Array.from(this.data!.chainlinks.values()),
      chaindecisions: Array.from(this.data!.chaindecisions.values()),
    };
  }

  public storeFileData = (fileData: string) => {
    console.log("Writing to storage:");
    console.log(fileData);
    const objectStore: StoreTO = JSON.parse(fileData);
    this.readData(objectStore);
    localStorage.setItem(STORE_ID, fileData);
  };

  public downloadData = (projectName: string) => {
    let dataStr = JSON.stringify(this.getDataStoreObject());
    let dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", projectName + ".json");
    linkElement.click();
  };

  public commitChanges(): void {
    this.saveData();
    this.readDataFromStorage();
  }

  public roleBack(): void {
    console.warn("Data Store: role back.");
    this.readDataFromStorage();
  }

  public getDataStore(): DataStoreCTO {
    if (!this.data) {
      this.readDataFromStorage();
    }
    return this.data!;
  }
}
const dataStore = new DataStore();

export default dataStore;
