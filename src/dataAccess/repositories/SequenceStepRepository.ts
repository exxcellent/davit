import { SequenceStepTO } from "../access/to/SequenceStepTO";
import dataStore from "../DataStore";

export const SequenceStepRepository = {
  find(stepId: number): SequenceStepTO | undefined {
    return dataStore.getDataStore().steps.get(stepId);
  },

  findAll(): SequenceStepTO[] {
    return Array.from(dataStore.getDataStore().steps.values());
  },
};
