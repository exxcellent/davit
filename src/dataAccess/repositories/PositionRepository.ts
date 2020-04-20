import dataStore from "../DataStore";
import PositionTO from "../PositionTO";

export class PositionRepository {
  static find(id: number): PositionTO | undefined {
    return dataStore.getDataStore().positions.get(id);
  }

  static findAll(): PositionTO[] {
    return Array.from(dataStore.getDataStore().positions.values());
  }
}
