import dataStore from "../DataStore";
import DesignTO from "../DesignTO";

export class DesignRepository {
  static find(id: number): DesignTO | undefined {
    return dataStore.getDataStore().designs.get(id);
  }

  static findAll(): DesignTO[] {
    return Array.from(dataStore.getDataStore().designs.values());
  }
}
