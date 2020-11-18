import { DataStoreCTO } from './access/cto/DataStoreCTO';
import { GoToTypes } from './access/types/GoToType';

export const ConstraintsHelper = {
    deleteDataConstraintCheck(dataId: number, dataStore: DataStoreCTO) {
        const dataRelationExists: boolean = Array.from(dataStore.dataConnections.values()).some(
            (relation) => relation.data1Fk === dataId || relation.data2Fk === dataId,
        );

        const actionExist: boolean = Array.from(dataStore.actions.values()).some(
            (actorData) => actorData.dataFk === dataId,
        );

        const decisionExists: boolean = Array.from(dataStore.decisions.values()).some((decision) =>
            decision.dataAndInstaceIds.some((dataAndInstaceId) => dataAndInstaceId.dataFk === dataId),
        );

        const chainDecisionExists: boolean = Array.from(dataStore.chaindecisions.values()).some((chainDecision) =>
            chainDecision.dataAndInstanceIds.some((dataAndInstance) => dataAndInstance.dataFk === dataId),
        );

        const initDataExists: boolean = Array.from(dataStore.initDatas.values()).some(
            (initData) => initData.dataFk === dataId,
        );

        if (dataRelationExists || actionExist || decisionExists || chainDecisionExists || initDataExists) {
            throw new Error(`delete.error! data with id: ${dataId} is still connected to Object(s)!`);
        }
    },

    deleteDataInstanceConstraintCheck(dataId: number, instanceId: number, dataStore: DataStoreCTO) {
        const actionExists: boolean = Array.from(dataStore.actions.values()).some(
            (action) => action.dataFk === dataId && action.instanceFk === instanceId,
        );

        const decisionExists: boolean = Array.from(dataStore.decisions.values()).some((decision) =>
            decision.dataAndInstaceIds.some(
                (dataAndInstanceId) =>
                    dataAndInstanceId.dataFk === dataId && dataAndInstanceId.instanceId === instanceId,
            ),
        );

        const chainDecisionExists: boolean = Array.from(dataStore.chaindecisions.values()).some((chainDecision) =>
            chainDecision.dataAndInstanceIds.some(
                (dataAndInstance) => dataAndInstance.dataFk === dataId && dataAndInstance.instanceId === instanceId,
            ),
        );

        const initDataExists: boolean = Array.from(dataStore.initDatas.values()).some(
            (initData) => initData.dataFk === dataId && initData.instanceFk === instanceId,
        );

        if (actionExists || decisionExists || initDataExists || chainDecisionExists) {
            throw new Error(`delete.error! data instance with id: ${instanceId} is still connected to Object(s)!`);
        }
    },

    deleteActorConstraintCheck(actorId: number, dataStore: DataStoreCTO) {
        const actionExists: boolean = Array.from(dataStore.actions.values()).some(
            (action) => action.sendingActorFk === actorId || action.receivingActorFk === actorId,
        );

        const decisionExists: boolean = Array.from(dataStore.decisions.values()).some(
            (decision) => decision.actorFk === actorId,
        );

        const chainDecisionExists: boolean = Array.from(dataStore.chaindecisions.values()).some(
            (chainDecision) => chainDecision.actorFk === actorId,
        );

        const initDataExists: boolean = Array.from(dataStore.initDatas.values()).some(
            (initData) => initData.actorFk === actorId,
        );

        if (actionExists || decisionExists || chainDecisionExists || initDataExists) {
            throw new Error(`delete.error! actor with id: ${actorId} is still connected to Object(s)!`);
        }
    },

    deleteStepConstraintCheck(stepId: number, dataStore: DataStoreCTO) {
        const sequenceExists: boolean = Array.from(dataStore.actions.values()).some(
            (actorData) => actorData.sequenceStepFk === stepId,
        );

        const actionExists: boolean = Array.from(dataStore.actions.values()).some(
            (action) => action.sequenceStepFk === stepId,
        );

        const decisionExists: boolean = Array.from(dataStore.decisions.values()).some(
            (decision) =>
                (decision.ifGoTo.type === GoToTypes.STEP && decision.ifGoTo.id === stepId) ||
                (decision.elseGoTo.type === GoToTypes.STEP && decision.elseGoTo.id === stepId),
        );

        if (sequenceExists || actionExists || decisionExists) {
            throw new Error(`delete.error! step: ${stepId} is still connected to actordata(s)!`);
        }
    },

    deleteSequenceConstraintCheck(sequenceId: number, dataStore: DataStoreCTO) {
        const stepExists: boolean = Array.from(dataStore.steps.values()).some((step) => step.sequenceFk === sequenceId);

        const decisionExists: boolean = Array.from(dataStore.decisions.values()).some(
            (dec) => dec.sequenceFk === sequenceId,
        );
        if (stepExists || decisionExists) {
            throw new Error(`delete.error! sequence: ${sequenceId} is still connected to step(s) or decision(s)!`);
        }
    },

    deleteChainConstraintCheck(chainId: number, dataStore: DataStoreCTO) {
        const linkExists: boolean = Array.from(dataStore.chainlinks.values()).some(
            (chainlink) => chainlink.chainFk === chainId,
        );

        const chainDecisionExists: boolean = Array.from(dataStore.chaindecisions.values()).some(
            (chainDecision) => chainDecision.chainFk === chainId,
        );

        if (linkExists || chainDecisionExists) {
            throw new Error(`delete.error! chain: ${chainId} is still connected to link(s) or chain decision(s)!`);
        }
    },

    deleteGeometricalDataConstraintCheck(geometDataId: number, dataStore: DataStoreCTO) {
        const actorExists: boolean = Array.from(dataStore.actors.values()).some(
            (actor) => actor.geometricalDataFk === geometDataId,
        );
        const dataExists: boolean = Array.from(dataStore.datas.values()).some(
            (data) => data.geometricalDataFk === geometDataId,
        );
        if (actorExists || dataExists) {
            throw new Error(`delete.error! geometrical data with id: ${geometDataId} is still connected to Object(s)!`);
        }
    },

    deletePositionConstraintCheck(positionId: number, dataStore: DataStoreCTO) {
        const geometDataExists: boolean = Array.from(dataStore.geometricalDatas.values()).some(
            (geoData) => geoData.positionFk === positionId,
        );
        if (geometDataExists) {
            throw new Error(`delete.error! position with id: ${positionId} is still connected to GeometricalData(s)!`);
        }
    },

    deleteDesignConstraintCheck(designId: number, dataStore: DataStoreCTO) {
        const actorExists: boolean = Array.from(dataStore.actors.values()).some((actor) => actor.designFk === designId);
        if (actorExists) {
            throw new Error(`delete.error! design with id: ${designId} is still connected to Actor(s)!`);
        }
    },

    deleteGroupConstraintCheck(groupId: number, dataStore: DataStoreCTO) {
        const actorExists: boolean = Array.from(dataStore.actors.values()).some((actor) => actor.groupFks === groupId);
        if (actorExists) {
            throw new Error(`delete.error! group with id: ${groupId} is still connected to Actor(s)!`);
        }
    },
};
