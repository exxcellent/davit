import { isNullOrUndefined } from "util";
import { ActionCTO } from "../dataAccess/access/cto/ActionCTO";
import { ComponentDataCTO } from "../dataAccess/access/cto/ComponentDataCTO";
import { ActionType } from "../dataAccess/access/types/ActionType";
import { ComponentDataState } from "../dataAccess/access/types/ComponentDataState";
import { Carv2Util } from "../utils/Carv2Util";

interface SequenceActionResult {
  componenDatas: ComponentDataCTO[];
  errors: ActionCTO[];
}

export const SequenceActionReducer = {
  executeActionsOnComponentDatas(actions: ActionCTO[], componentDatas: ComponentDataCTO[]): SequenceActionResult {
    let newComponentDatas: ComponentDataCTO[] = Carv2Util.deepCopy(componentDatas);
    let errors: ActionCTO[] = [];

    actions.forEach((action) => {
      const index: number = findComponentDataIndex(action.componentTO.id, action.dataTO.id, newComponentDatas);
      // modification
      let result: { compData: ComponentDataCTO | undefined; errorItem: ActionCTO | null };
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

const findComponentDataIndex = (compId: number, dataId: number, componentDatas: ComponentDataCTO[]): number => {
  return componentDatas.findIndex((compData) => compData.componentTO.id === compId && compData.dataTO.id === dataId);
};

const createErrorComponentDataFromAction = (action: ActionCTO): ComponentDataCTO => {
  return {
    componentDataTO: {
      id: -1,
      componentDataState: ComponentDataState.NEW,
      componentFk: action.componentTO.id,
      dataFk: action.dataTO.id,
      sequenceStepFk: action.actionTO.sequenceStepFk,
    },
    componentTO: action.componentTO,
    dataTO: action.dataTO,
  };
};

const executeActionOnComponentData = (
  action: ActionCTO,
  componentData?: ComponentDataCTO
): { compData: ComponentDataCTO | undefined; errorItem: ActionCTO | null } => {
  let newCompData: ComponentDataCTO | undefined = Carv2Util.deepCopy(componentData);
  let errorItem: ActionCTO | null = null;

  // create as default an error compData and set the state if its no error
  switch (action.actionTO.actionType) {
    case ActionType.ADD:
      if (
        componentData === undefined ||
        componentData.componentDataTO.componentDataState === ComponentDataState.DELETED
      ) {
        newCompData = createErrorComponentDataFromAction(action);
        newCompData.componentDataTO.componentDataState = ComponentDataState.NEW;
      } else {
        errorItem = Carv2Util.deepCopy(action);
      }
      break;
    case ActionType.CHECK:
      if (
        componentData !== undefined &&
        componentData.componentDataTO.componentDataState !== ComponentDataState.DELETED
      ) {
        newCompData = createErrorComponentDataFromAction(action);
        newCompData.componentDataTO.componentDataState = ComponentDataState.PERSISTENT;
      } else {
        errorItem = Carv2Util.deepCopy(action);
      }
      break;
    case ActionType.DELETE:
      if (
        componentData !== undefined &&
        componentData.componentDataTO.componentDataState !== ComponentDataState.DELETED
      ) {
        newCompData = createErrorComponentDataFromAction(action);
        newCompData.componentDataTO.componentDataState = ComponentDataState.DELETED;
      } else {
        errorItem = Carv2Util.deepCopy(action);
      }
      break;
  }

  return { compData: newCompData, errorItem };
};
