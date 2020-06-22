import { DataStoreCTO } from "./access/cto/DataStoreCTO";

export const ConstraintsHelper = {
  deleteDataConstraintCheck(dataId: number, dataStore: DataStoreCTO) {
    const dataRelationExists: boolean = Array.from(dataStore.dataConnections.values()).some(
      (relation) => relation.data1Fk === dataId || relation.data2Fk === dataId
    );
    const compDataExist: boolean = Array.from(dataStore.actions.values()).some(
      (compData) => compData.dataFk === dataId
    );
    if (dataRelationExists || compDataExist) {
      throw new Error(`delete.error! data with id: ${dataId} is still connected to Object(s)!`);
    }
  },

  deleteComponentConstraintCheck(componentId: number, dataStore: DataStoreCTO) {
    const compDataExists: boolean = Array.from(dataStore.actions.values()).some(
      (compData) => compData.componentFk === componentId
    );
    const stepContainsComponent: boolean = Array.from(dataStore.steps.values()).some(
      (step) => step.sourceComponentFk === componentId || step.targetComponentFk === componentId
    );

    if (compDataExists || stepContainsComponent) {
      throw new Error(`delete.error! component with id: ${componentId} is still connected to Object(s)!`);
    }
  },

  deleteStepConstraintCheck(stepId: number, dataStore: DataStoreCTO) {
    const componentDataExists: boolean = Array.from(dataStore.actions.values()).some(
      (compData) => compData.sequenceStepFk === stepId
    );
    if (componentDataExists) {
      throw new Error(`delete.error! step: ${stepId} is still connected to componentdata(s)!`);
    }
  },

  deleteSequenceConstraintCheck(sequenceId: number, dataStore: DataStoreCTO) {
    const stepExists: boolean = Array.from(dataStore.steps.values()).some((step) => step.sequenceFk === sequenceId);
    if (stepExists) {
      throw new Error(`delete.error! sequence: ${sequenceId} is still connected to step(s)!`);
    }
  },

  deleteGeometricalDataConstraintCheck(geometDataId: number, dataStore: DataStoreCTO) {
    const componentExists: boolean = Array.from(dataStore.components.values()).some(
      (component) => component.geometricalDataFk === geometDataId
    );
    const dataExists: boolean = Array.from(dataStore.datas.values()).some(
      (data) => data.geometricalDataFk === geometDataId
    );
    if (componentExists || dataExists) {
      throw new Error(`delete.error! geometrical data with id: ${geometDataId} is still connected to Object(s)!`);
    }
  },

  deletePositionConstraintCheck(positionId: number, dataStore: DataStoreCTO) {
    const geometDataExists: boolean = Array.from(dataStore.geometricalDatas.values()).some(
      (geoData) => geoData.positionFk === positionId
    );
    if (geometDataExists) {
      throw new Error(`delete.error! position with id: ${positionId} is still connected to GeometricalData(s)!`);
    }
  },

  deleteDesignConstraintCheck(designId: number, dataStore: DataStoreCTO) {
    const componentExists: boolean = Array.from(dataStore.components.values()).some(
      (component) => component.designFk === designId
    );
    if (componentExists) {
      throw new Error(`delete.error! design with id: ${designId} is still connected to Component(s)!`);
    }
  },

  deleteGroupConstraintCheck(groupId: number, dataStore: DataStoreCTO) {
    const componentExists: boolean = Array.from(dataStore.components.values()).some(
      (component) => component.groupFks === groupId
    );
    if (componentExists) {
      throw new Error(`delete.error! group with id: ${groupId} is still connected to Component(s)!`);
    }
  },
};
