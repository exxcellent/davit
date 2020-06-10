import { DataStoreCTO } from "./access/cto/DataStoreCTO";
import { ComponentDataTO } from "./access/to/ComponentDataTO";
import { ComponentTO } from "./access/to/ComponentTO";
import { DataRelationTO } from "./access/to/DataRelationTO";
import { DataTO } from "./access/to/DataTO";
import { DesignTO } from "./access/to/DesignTO";
import { GeometricalDataTO } from "./access/to/GeometricalDataTO";
import { PositionTO } from "./access/to/PositionTO";
import { SequenceStepTO } from "./access/to/SequenceStepTO";
import { SequenceTO } from "./access/to/SequenceTO";

export const ConstraintsHelper = {
  deleteData(data: DataTO, dataStore: DataStoreCTO) {
    let geometricalData: GeometricalDataTO | undefined = undefined;
    let position: PositionTO | undefined = undefined;
    //check if no technikal data is still connected
    geometricalData = dataStore.geometricalDatas.get(data.geometricalDataFk);
    if (geometricalData) {
      position = dataStore.positions.get(geometricalData.positionFk);
    }
    // check if no Relation is still connected
    const dataRelations: DataRelationTO[] = Array.from(dataStore.dataConnections.values());
    const dataRelationExists: boolean = dataRelations.some(
      (relation) => relation.data1Fk === data.id || relation.data2Fk === data.id
    );
    //check if no componentdata is still connected
    const componentdatas: ComponentDataTO[] = Array.from(dataStore.componentDatas.values());
    const compDataExist: boolean = componentdatas.some((compData) => compData.dataFk === data.id);

    if (geometricalData !== undefined || position !== undefined || dataRelationExists || compDataExist) {
      throw new Error(`delete.error! data: ${data.name} is still connected to Object(s)!`);
    }
  },

  deleteComponent(component: ComponentTO, dataStore: DataStoreCTO) {
    let geometricalData: GeometricalDataTO | undefined = undefined;
    let position: PositionTO | undefined = undefined;
    let design: DesignTO | undefined = undefined;
    design = dataStore.designs.get(component.designFk);
    geometricalData = dataStore.geometricalDatas.get(component.geometricalDataFk);
    if (geometricalData) {
      position = dataStore.positions.get(geometricalData.positionFk);
    }
    const componentDatas: ComponentDataTO[] = Array.from(dataStore.componentDatas.values());
    const compDataExists: boolean = componentDatas.some((compData) => compData.componentFk === component.id);

    const steps: SequenceStepTO[] = Array.from(dataStore.steps.values());
    const stepContainsComponent: boolean = steps.some(
      (step) => step.sourceComponentFk === component.id || step.targetComponentFk === component.id
    );

    if (
      design !== undefined ||
      geometricalData !== undefined ||
      position !== undefined ||
      compDataExists ||
      stepContainsComponent
    ) {
      throw new Error(`delete.error! component: ${component.name} is still connected to Object(s)!`);
    }
  },

  deleteStep(step: SequenceStepTO, dataStore: DataStoreCTO) {
    const componentDatas: ComponentDataTO[] = Array.from(dataStore.componentDatas.values());
    const componentDataExists: boolean = componentDatas.some((compData) => compData.sequenceStepFk === step.id);
    if (componentDataExists) {
      throw new Error(`delete.error! step: ${step.name} is still connected to componentdata(s)!`);
    }
  },

  deleteSequence(sequence: SequenceTO, dataStore: DataStoreCTO) {
    const steps: SequenceStepTO[] = Array.from(dataStore.steps.values());
    const stepExists: boolean = steps.some((step) => step.sequenceFk === sequence.id);
    if (stepExists) {
      throw new Error(`delete.error! sequence: ${sequence.name} is still connected to step(s)!`);
    }
  },
};
