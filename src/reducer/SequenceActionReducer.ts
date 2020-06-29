import { isNullOrUndefined } from "util";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { ActionType } from "../dataAccess/access/types/ActionType";
import { Carv2Util } from "../utils/Carv2Util";
import { ComponentData } from "../viewDataTypes/ComponentData";

export interface SequenceActionResult {
  componenDatas: ComponentData[];
  errors: ActionTO[];
}

export const SequenceActionReducer = {
  executeActionsOnComponentDatas(actions: ActionTO[], componentDatas: ComponentData[]): SequenceActionResult {
    let newComponentDatas: ComponentData[] = Carv2Util.deepCopy(componentDatas);
    let errors: ActionTO[] = [];

    actions.forEach((action) => {
      const index: number = findComponentDataIndex(action.componentFk, action.dataFk, newComponentDatas);
      // modification
      let result: { compData: ComponentData | undefined; errorItem: ActionTO | null };
      if (index > -1) {
        // comData exists => check => do nothing or delete => delete the element
        result = executeActionOnComponentData(action, newComponentDatas[index]);
        if (isNullOrUndefined(result.compData)) {
          newComponentDatas.splice(index, 1);
        }
      } else {
        result = executeActionOnComponentData(action);
        if (!isNullOrUndefined(result.compData)) {
          newComponentDatas.push(result.compData);
        }
      }
      if (!isNullOrUndefined(result.errorItem)) {
        errors.push(result.errorItem);
      }
    });
    return { componenDatas: newComponentDatas, errors };
  },
};

const findComponentDataIndex = (compId: number, dataId: number, componentDatas: ComponentData[]): number => {
  return componentDatas.findIndex((compData) => compData.componentFk === compId && compData.dataFk === dataId);
};

const executeActionOnComponentData = (
  action: ActionTO,
  componentData?: ComponentData
): { compData: ComponentData | undefined; errorItem: ActionTO | null } => {
  let newCompData: ComponentData | undefined = Carv2Util.deepCopy(componentData);
  let errorItem: ActionTO | null = null;

  // create as default an error compData and set the state if its no error
  switch (action.actionType) {
    case ActionType.ADD:
      if (componentData === undefined) {
        newCompData = {
          componentFk: action.componentFk,
          dataFk: action.dataFk,
        };
      } else {
        errorItem = Carv2Util.deepCopy(action);
      }
      break;
    case ActionType.CHECK:
      if (componentData === undefined) {
        errorItem = Carv2Util.deepCopy(action);
      }
      break;
    case ActionType.DELETE:
      if (componentData !== undefined) {
        newCompData = undefined;
      } else {
        errorItem = Carv2Util.deepCopy(action);
      }
      break;
  }

  return { compData: newCompData, errorItem };
};
