import { SequenceTO } from "../access/to/SequenceTO";
import dataStore from "../DataStore";

export const SequenceRepository = {
  find(sequenceId: number): SequenceTO | undefined {
    return dataStore.getDataStore().sequences.get(sequenceId);
  },
  findAll(): SequenceTO[] {
    return Array.from(dataStore.getDataStore().sequences.values());
  },
};
