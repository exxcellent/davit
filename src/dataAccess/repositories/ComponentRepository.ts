import ComponentTO from "../ComponentTO";
import dataStore from "../DataStore";

export class ComponentRepository {
  static find(id: number): ComponentTO | undefined {
    return dataStore.getDataStore().components.get(id);
  }

  static findAll(): ComponentTO[] {
    return Array.from(dataStore.getDataStore().components.values());
  }
}
