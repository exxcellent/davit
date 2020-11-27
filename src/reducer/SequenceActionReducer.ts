import { ActionTO } from '../dataAccess/access/to/ActionTO';
import { DecisionTO } from '../dataAccess/access/to/DecisionTO';
import { ActionType } from '../dataAccess/access/types/ActionType';
import { GoTo } from '../dataAccess/access/types/GoToType';
import { ActorData } from '../viewDataTypes/ActorData';
import { ActorDataState } from '../viewDataTypes/ActorDataState';

export interface SequenceActionResult {
    actorDatas: ActorData[];
    errors: ActionTO[];
}
export interface SequenceDecisionResult {
    actorDatas: ActorData[];
    goto: GoTo;
}

export const SequenceActionReducer = {
    executeActionsOnActorDatas(actions: ActionTO[], actorDatas: ActorData[]): SequenceActionResult {
        // copy actorDatas and set all to state PERSISTENT
        const newActorDatas: ActorData[] = actorDatas
            .filter((actorData) => !isTransiantState(actorData.state))
            .map((actorData) => {
                return { ...actorData, state: ActorDataState.PERSISTENT };
            });
        const errors: ActionTO[] = [];

        actions.forEach((action) => {
            const indexActorDataToEdit: number = findActorDataIndex(
                action.receivingActorFk,
                action.dataFk,
                newActorDatas,
            );
            const indexActorDataSending: number = findActorDataIndex(
                action.sendingActorFk,
                action.dataFk,
                newActorDatas,
            );
            switch (action.actionType) {
                case ActionType.ADD:
                    if (!actorDataIsPresent(indexActorDataToEdit)) {
                        newActorDatas.push({
                            actorFk: action.receivingActorFk,
                            dataFk: action.dataFk,
                            instanceFk: action.instanceFk,
                            state: ActorDataState.NEW,
                        });
                    } else if (newActorDatas[indexActorDataToEdit].instanceFk !== action.instanceFk) {
                        newActorDatas.push({
                            actorFk: action.receivingActorFk,
                            dataFk: action.dataFk,
                            instanceFk: action.instanceFk,
                            state: ActorDataState.UPDATED_TO,
                        });
                        newActorDatas[indexActorDataToEdit] = {
                            ...newActorDatas[indexActorDataToEdit],
                            state: ActorDataState.UPDATED_FROM,
                        };
                    } else {
                        errors.push(action);
                    }
                    break;
                case ActionType.DELETE:
                    actorDataIsPresent(indexActorDataToEdit)
                        ? (newActorDatas[indexActorDataToEdit].state = ActorDataState.DELETED)
                        : errors.push(action);
                    break;
                case ActionType.SEND:
                    if (actorDataIsPresent(indexActorDataSending)) {
                        const actorData: ActorData = {
                            actorFk: action.receivingActorFk,
                            dataFk: action.dataFk,
                            instanceFk: newActorDatas[indexActorDataSending].instanceFk,
                            state: ActorDataState.SENT,
                        };
                        newActorDatas[indexActorDataSending].state = ActorDataState.SENT;
                        if (actorDataIsPresent(indexActorDataToEdit)) {
                            newActorDatas.push({
                                actorFk: action.receivingActorFk,
                                dataFk: action.dataFk,
                                instanceFk: newActorDatas[indexActorDataToEdit].instanceFk,
                                state: ActorDataState.UPDATED_FROM,
                            });
                            newActorDatas[indexActorDataToEdit] = { ...actorData, state: ActorDataState.UPDATED_TO };
                        } else {
                            newActorDatas.push(actorData);
                        }
                    } else {
                        errors.push(action);
                    }
                    break;
                case ActionType.SEND_AND_DELETE:
                    if (actorDataIsPresent(indexActorDataSending)) {
                        const actorData: ActorData = {
                            actorFk: action.receivingActorFk,
                            dataFk: action.dataFk,
                            instanceFk: newActorDatas[indexActorDataSending].instanceFk,
                            state: ActorDataState.SENT,
                        };
                        newActorDatas[indexActorDataSending].state = ActorDataState.DELETED;
                        if (actorDataIsPresent(indexActorDataToEdit)) {
                            newActorDatas[indexActorDataToEdit] = { ...actorData, state: ActorDataState.UPDATED_TO };
                        } else {
                            newActorDatas.push(actorData);
                        }
                    } else {
                        errors.push(action);
                    }
                    break;
            }
        });
        return { actorDatas: newActorDatas, errors };
    },

    executeDecisionCheck(decision: DecisionTO, actorDatas: ActorData[]): SequenceDecisionResult {
        const newActorDatas: ActorData[] = actorDatas
            .filter(
                (actorData) =>
                    actorData.state !== ActorDataState.DELETED && actorData.state !== ActorDataState.CHECK_FAILED,
            )
            .map((actorData) => {
                return { ...actorData, state: ActorDataState.PERSISTENT };
            });
        const filteredActorData: ActorData[] = newActorDatas.filter(
            (actorData) => actorData.actorFk === decision.actorFk,
        );
        let goTo = decision.ifGoTo;
        console.info('decision: ', decision);
        console.info('decision dataAndInscatnceIds: ', decision.dataAndInstaceIds);
        decision.dataAndInstaceIds.forEach((dataAndInstanceId) => {
            // if data and instance id are defined search exact match. if only data id is defined search for any instance of that data
            const checkedActorDatas: ActorData[] = filteredActorData.filter(
                (actor) =>
                    actor.dataFk === dataAndInstanceId.dataFk &&
                    (!dataAndInstanceId.instanceId || actor.instanceFk === dataAndInstanceId.instanceId),
            );

            if (dataIsPresentOnActor(checkedActorDatas)) {
                checkedActorDatas.forEach((actorData) => (actorData.state = ActorDataState.CHECKED));
            } else {
                newActorDatas.push({
                    actorFk: decision.actorFk,
                    dataFk: dataAndInstanceId.dataFk,
                    instanceFk: dataAndInstanceId.instanceId,
                    state: ActorDataState.CHECK_FAILED,
                });
                goTo = decision.elseGoTo;
            }
        });
        return { actorDatas: newActorDatas, goto: goTo };
    },
};

const findActorDataIndex = (actorId: number, dataId: number, actorDatas: ActorData[]): number => {
    return actorDatas.findIndex(
        (actorData) =>
            actorData.actorFk === actorId && actorData.dataFk === dataId && !isTransiantState(actorData.state),
    );
};

const isTransiantState = (state: ActorDataState) => {
    return (
        state === ActorDataState.DELETED ||
        state === ActorDataState.UPDATED_FROM ||
        state === ActorDataState.CHECK_FAILED
    );
};
function actorDataIsPresent(indexActorDataToEdit: number) {
    return indexActorDataToEdit !== -1;
}

const dataIsPresentOnActor = (actorData: ActorData[]) => {
    return actorData && actorData.length > 0;
};
