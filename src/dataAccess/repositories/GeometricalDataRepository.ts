import dataStore from "../DataStore";
import GeometricalDataTO from "../GeometricalDataTO";

export class GeometricalDataRepository {
  static find(id: number): GeometricalDataTO | undefined {
    return dataStore.getDataStore().geometricalData.get(id);
  }

  static findAll(): GeometricalDataTO[] {
    return Array.from(dataStore.getDataStore().geometricalData.values());
  }
}
