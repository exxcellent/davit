import { ActionTO } from '../dataAccess/access/to/ActionTO';
import { DecisionTO } from '../dataAccess/access/to/DecisionTO';
import { ActionType } from '../dataAccess/access/types/ActionType';
import { GoTo } from '../dataAccess/access/types/GoToType';
import { Carv2Util } from '../utils/Carv2Util';
import { ActorData } from '../viewDataTypes/ActorData';

export interface SequenceActionResult {
  actorDatas: ActorData[];
  errors: ActionTO[];
}

interface Result {
  actorData: ActorData | undefined;
  sendingActorData: ActorData | undefined;
  errorItem: ActionTO | null;
}

export const SequenceActionReducer = {
  executeActionsOnActorDatas(actions: ActionTO[], actorDatas: ActorData[]): SequenceActionResult {
    let newActorDatas: ActorData[] = Carv2Util.deepCopy(actorDatas);
    let errors: ActionTO[] = [];

    actions.forEach((action) => {
      const indexActorToEdit: number = findActorDataIndex(
        action.receivingActorFk, 
        action.dataFk, 
        newActorDatas
        );
      const indexActorSending: number = findActorDataIndex(
        action.sendingActorFk,
        action.dataFk,
        newActorDatas
      );
      switch (action.actionType) {
        case ActionType.ADD:
          indexActorToEdit === -1
            ? newActorDatas.push({ actorFk: action.receivingActorFk, dataFk: action.dataFk, instanceFk: action.instanceFk })
            : errors.push(action);
          break;
        case ActionType.DELETE:
          indexActorToEdit !== -1 ? newActorDatas.splice(indexActorToEdit, 1) : errors.push(action);
          break;
        case ActionType.SEND:
          indexActorSending !== -1 && indexActorToEdit === -1
            ? newActorDatas.push({ actorFk: action.receivingActorFk, dataFk: action.dataFk, instanceFk: newActorDatas[indexActorSending].instanceFk })
            : errors.push(action);
          break;
        case ActionType.SEND_AND_DELETE:
          if (indexActorSending !== -1 && indexActorToEdit === -1) {
            newActorDatas.push({ actorFk: action.receivingActorFk, dataFk: action.dataFk, instanceFk: newActorDatas[indexActorSending].instanceFk });
            newActorDatas.splice(indexActorSending, 1);
          } else {
            errors.push(action);
          }
          break;
      }
    });
    return { actorDatas: newActorDatas, errors };
  },

  executeDecisionCheck(decision: DecisionTO, actorDatas: ActorData[]): GoTo {
    const filteredActorData: ActorData[] = actorDatas.filter(
      (actorData) => actorData.actorFk === decision.actorFk
    );
    let goTo: GoTo | undefined;
    decision.dataAndInstaceId.forEach((dataFk) => {
      let isIncluded: boolean = filteredActorData.some((actor) => actor.dataFk === dataFk.dataFk);
      if (decision.has !== isIncluded) {
        goTo = decision.elseGoTo;
      }
    });
    return goTo || decision.ifGoTo;
  },
};

const findActorDataIndex = (actorId: number, dataId: number, actorDatas: ActorData[]): number => {
  return actorDatas.findIndex((actorData) => actorData.actorFk === actorId && actorData.dataFk === dataId);
};
