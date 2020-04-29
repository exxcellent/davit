import { ComponentDataTO } from "../access/to/ComponentDataTO";
import dataStore from "../DataStore";

export const ComponentDataRepository = {
  find(componentDataId: number): ComponentDataTO | undefined {
    return dataStore.getDataStore().componentDatas.get(componentDataId);
  },

  findAll(): ComponentDataTO[] {
    return Array.from(dataStore.getDataStore().componentDatas.values());
  },

  findAllForStep(stepId: number): ComponentDataTO[] {
    return this.findAll().filter(
      (componentData) => componentData.sequenceStepFk === stepId
    );
  },
};
