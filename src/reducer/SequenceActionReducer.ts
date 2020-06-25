import { isNullOrUndefined } from "util";
import { ActionCTO } from "../dataAccess/access/cto/ActionCTO";
import { ComponentDataTO } from "../dataAccess/access/to/ComponentDataTO";
import { ActionType } from "../dataAccess/access/types/ActionType";
import { ComponentDataState } from "../dataAccess/access/types/ComponentDataState";
import { Carv2Util } from "../utils/Carv2Util";

export interface SequenceActionResult {
  componenDatas: ComponentDataTO[];
  errors: ActionCTO[];
}

export const SequenceActionReducer = {
  executeActionsOnComponentDatas(actions: ActionCTO[], componentDatas: ComponentDataTO[]): SequenceActionResult {
    let newComponentDatas: ComponentDataTO[] = Carv2Util.deepCopy(componentDatas);
    let errors: ActionCTO[] = [];

    actions.forEach((action) => {
      const index: number = findComponentDataIndex(action.componentTO.id, action.dataTO.id, newComponentDatas);
      // modification
      let result: { compData: ComponentDataTO | undefined; errorItem: ActionCTO | null };
      if (index > -1) {
        result = executeActionOnComponentData(action, newComponentDatas[index]);
        if (!isNullOrUndefined(result.compData)) {
          newComponentDatas[index] = result.compData;
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

const findComponentDataIndex = (compId: number, dataId: number, componentDatas: ComponentDataTO[]): number => {
  return componentDatas.findIndex((compData) => compData.componentFk === compId && compData.dataFk === dataId);
};

const createErrorComponentDataFromAction = (action: ActionCTO): ComponentDataTO => {
  return {
    id: -1,
    componentDataState: ComponentDataState.NEW,
    componentFk: action.componentTO.id,
    dataFk: action.dataTO.id,
    sequenceStepFk: action.actionTO.sequenceStepFk,
  };
};

const executeActionOnComponentData = (
  action: ActionCTO,
  componentData?: ComponentDataTO
): { compData: ComponentDataTO | undefined; errorItem: ActionCTO | null } => {
  let newCompData: ComponentDataTO | undefined = Carv2Util.deepCopy(componentData);
  let errorItem: ActionCTO | null = null;

  // create as default an error compData and set the state if its no error
  switch (action.actionTO.actionType) {
    case ActionType.ADD:
      if (componentData === undefined || componentData.componentDataState === ComponentDataState.DELETED) {
        newCompData = createErrorComponentDataFromAction(action);
        newCompData.componentDataState = ComponentDataState.NEW;
      } else {
        errorItem = Carv2Util.deepCopy(action);
      }
      break;
    case ActionType.CHECK:
      if (componentData !== undefined && componentData.componentDataState !== ComponentDataState.DELETED) {
        newCompData = createErrorComponentDataFromAction(action);
        newCompData.componentDataState = ComponentDataState.PERSISTENT;
      } else {
        errorItem = Carv2Util.deepCopy(action);
      }
      break;
    case ActionType.DELETE:
      if (componentData !== undefined && componentData.componentDataState !== ComponentDataState.DELETED) {
        newCompData = createErrorComponentDataFromAction(action);
        newCompData.componentDataState = ComponentDataState.DELETED;
      } else {
        errorItem = Carv2Util.deepCopy(action);
      }
      break;
  }

  return { compData: newCompData, errorItem };
};
