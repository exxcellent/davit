import { ComponentDataTO } from "../access/to/ComponentDataTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ComponentDataRepository = {
  find(componentDataId: number): ComponentDataTO | undefined {
    return dataStore.getDataStore().componentDatas.get(componentDataId);
  },

  findAll(): ComponentDataTO[] {
    return Array.from(dataStore.getDataStore().componentDatas.values());
  },

  findAllForStep(stepId: number): ComponentDataTO[] {
    return this.findAll().filter((componentData) => componentData.sequenceStepFk === stepId);
  },

  save(componentData: ComponentDataTO): ComponentDataTO {
    CheckHelper.nullCheck(componentData, "componentData");
    let componentDataTO: ComponentDataTO;
    if (componentData.id === -1) {
      componentDataTO = {
        ...componentData,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
    } else {
      componentDataTO = { ...componentData };
    }
    dataStore.getDataStore().componentDatas.set(componentDataTO.id, componentDataTO);
    return componentData;
  },

  delete(id: number) {
    const sucess: boolean = dataStore.getDataStore().componentDatas.delete(id);
    if (!sucess) {
      throw Error("could not delete componentData with id: " + id);
    }
  },
};
