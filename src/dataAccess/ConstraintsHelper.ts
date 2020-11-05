import {DataStoreCTO} from './access/cto/DataStoreCTO';

export const ConstraintsHelper = {
  deleteDataConstraintCheck(dataId: number, dataStore: DataStoreCTO) {
    const dataRelationExists: boolean = Array.from(dataStore.dataConnections.values()).some(
        (relation) => relation.data1Fk === dataId || relation.data2Fk === dataId,
    );
    const actorDataExist: boolean = Array.from(dataStore.actions.values()).some(
        (actorData) => actorData.dataFk === dataId,
    );
    if (dataRelationExists || actorDataExist) {
      throw new Error(`delete.error! data with id: ${dataId} is still connected to Object(s)!`);
    }
  },

  deleteActorConstraintCheck(actorId: number, dataStore: DataStoreCTO) {
    const actorDataExists: boolean = Array.from(dataStore.actions.values()).some(
        (actorData) => actorData.receivingActorFk === actorId,
    );
    const stepContainsActor: boolean = Array.from(dataStore.actions.values()).some(
        (action) => action.sendingActorFk === actorId || action.receivingActorFk === actorId,
    );

    if (actorDataExists || stepContainsActor) {
      throw new Error(`delete.error! actor with id: ${actorId} is still connected to Object(s)!`);
    }
  },

  deleteStepConstraintCheck(stepId: number, dataStore: DataStoreCTO) {
    const actorDataExists: boolean = Array.from(dataStore.actions.values()).some(
        (actorData) => actorData.sequenceStepFk === stepId,
    );
    if (actorDataExists) {
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
    // TODO: add constraint!
    // const stepExists: boolean = Array.from(dataStore.steps.values()).some((step) => step.sequenceFk === chainId);
    // if (stepExists) {
    //   throw new Error(`delete.error! sequence: ${chainId} is still connected to step(s)!`);
    // }
    return true;
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
    const actorExists: boolean = Array.from(dataStore.actors.values()).some(
        (actor) => actor.designFk === designId,
    );
    if (actorExists) {
      throw new Error(`delete.error! design with id: ${designId} is still connected to Actor(s)!`);
    }
  },

  deleteGroupConstraintCheck(groupId: number, dataStore: DataStoreCTO) {
    const actorExists: boolean = Array.from(dataStore.actors.values()).some(
        (actor) => actor.groupFks === groupId,
    );
    if (actorExists) {
      throw new Error(`delete.error! group with id: ${groupId} is still connected to Actor(s)!`);
    }
  },
};
