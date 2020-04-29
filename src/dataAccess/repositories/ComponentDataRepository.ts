import { ComponentDataTO } from "../access/to/ComponentDataTO";
import dataStore from "../DataStore";

export const ComponentDataRepository = {
  find(componentDataId: number): ComponentDataTO | undefined {
    return dataStore.getDataStore().componentData.get(componentDataId);
  },

  findAll(): ComponentDataTO[] {
    return Array.from(dataStore.getDataStore().componentData.values());
  },
};
