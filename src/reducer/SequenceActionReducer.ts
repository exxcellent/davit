import { ActionTO } from '../dataAccess/access/to/ActionTO';
import { DecisionTO } from '../dataAccess/access/to/DecisionTO';
import { ActionType } from '../dataAccess/access/types/ActionType';
import { GoTo } from '../dataAccess/access/types/GoToType';
import { Carv2Util } from '../utils/Carv2Util';
import { ComponentData } from '../viewDataTypes/ComponentData';

export interface SequenceActionResult {
  componenDatas: ComponentData[];
  errors: ActionTO[];
}

interface Result {
  compData: ComponentData | undefined;
  sendingCompData: ComponentData | undefined;
  errorItem: ActionTO | null;
}

export const SequenceActionReducer = {
  executeActionsOnComponentDatas(actions: ActionTO[], componentDatas: ComponentData[]): SequenceActionResult {
    let newComponentDatas: ComponentData[] = Carv2Util.deepCopy(componentDatas);
    let errors: ActionTO[] = [];

    actions.forEach((action) => {
      const indexComponentToEdit: number = findComponentDataIndex(
        action.receivingComponentFk, 
        action.dataFk, 
        newComponentDatas
        );
      const indexComponentSending: number = findComponentDataIndex(
        action.sendingComponentFk,
        action.dataFk,
        newComponentDatas
      );
      switch (action.actionType) {
        case ActionType.ADD:
          indexComponentToEdit === -1
            ? newComponentDatas.push({ componentFk: action.receivingComponentFk, dataFk: action.dataFk, instanceFk: action.instanceFk })
            : errors.push(action);
          break;
        case ActionType.DELETE:
          indexComponentToEdit !== -1 ? newComponentDatas.splice(indexComponentToEdit, 1) : errors.push(action);
          break;
        case ActionType.SEND:
          indexComponentSending !== -1 && indexComponentToEdit === -1
            ? newComponentDatas.push({ componentFk: action.receivingComponentFk, dataFk: action.dataFk, instanceFk: newComponentDatas[indexComponentSending].instanceFk })
            : errors.push(action);
          break;
        case ActionType.SEND_AND_DELETE:
          if (indexComponentSending !== -1 && indexComponentToEdit === -1) {
            newComponentDatas.push({ componentFk: action.receivingComponentFk, dataFk: action.dataFk, instanceFk: newComponentDatas[indexComponentSending].instanceFk });
            newComponentDatas.splice(indexComponentSending, 1);
          } else {
            errors.push(action);
          }
          break;
      }
    });
    return { componenDatas: newComponentDatas, errors };
  },

  executeDecisionCheck(decision: DecisionTO, componenDatas: ComponentData[]): GoTo {
    const filteredCompData: ComponentData[] = componenDatas.filter(
      (compData) => compData.componentFk === decision.componentFk
    );
    let goTo: GoTo | undefined;
    decision.dataAndInstaceId.forEach((dataFk) => {
      let isIncluded: boolean = filteredCompData.some((cd) => cd.dataFk === dataFk.dataFk);
      if (decision.has !== isIncluded) {
        goTo = decision.elseGoTo;
      }
    });
    return goTo || decision.ifGoTo;
  },
};

const findComponentDataIndex = (compId: number, dataId: number, componentDatas: ComponentData[]): number => {
  return componentDatas.findIndex((compData) => compData.componentFk === compId && compData.dataFk === dataId);
};
