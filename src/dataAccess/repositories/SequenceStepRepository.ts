import { SequenceStepTO } from "../access/to/SequenceStepTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const SequenceStepRepository = {
  find(stepId: number): SequenceStepTO | undefined {
    return dataStore.getDataStore().steps.get(stepId);
  },

  findAll(): SequenceStepTO[] {
    return Array.from(dataStore.getDataStore().steps.values());
  },

  findAllForSequence(sequenceId: number) {
    return this.findAll().filter((step) => step.sequenceFk === sequenceId);
  },

  save(sequenceStep: SequenceStepTO): SequenceStepTO {
    CheckHelper.nullCheck(sequenceStep, "sequenceStep");
    let sequenceStepTO: SequenceStepTO;
    if (sequenceStep.id === -1) {
      sequenceStepTO = {
        ...sequenceStep,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
    } else {
      sequenceStepTO = { ...sequenceStep };
    }
    dataStore.getDataStore().steps.set(sequenceStepTO.id!, sequenceStepTO);
    return sequenceStepTO;
  },
};
