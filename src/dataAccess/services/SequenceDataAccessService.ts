import { ComponentCTO } from "../access/cto/ComponentCTO";
import { ComponentDataCTO } from "../access/cto/ComponentDataCTO";
import { SequenceCTO } from "../access/cto/SequenceCTO";
import { SequenceStepCTO } from "../access/cto/SequenceStepCTO";
import { ComponentDataTO } from "../access/to/ComponentDataTO";
import { ComponentTO } from "../access/to/ComponentTO";
import { DataTO } from "../access/to/DataTO";
import { SequenceStepTO } from "../access/to/SequenceStepTO";
import { SequenceTO } from "../access/to/SequenceTO";
import { ComponentDataRepository } from "../repositories/ComponentDataRepository";
import { ComponentRepository } from "../repositories/ComponentRepository";
import { DataRepository } from "../repositories/DataRepository";
import { SequenceRepository } from "../repositories/SequenceRepository";
import { SequenceStepRepository } from "../repositories/SequenceStepRepository";
import { CheckHelper } from "../util/CheckHelper";
import { createComponentCTO } from "./ComponentDataAccessService";

export const SequenceDataAccessService = {
  find(sequenceId: number): SequenceCTO {
    return createSequenceCTO(SequenceRepository.find(sequenceId));
  },

  findAll(): SequenceTO[] {
    return SequenceRepository.findAll();
  },
};

const createSequenceCTO = (sequence: SequenceTO | undefined): SequenceCTO => {
  CheckHelper.nullCheck(sequence, "sequence");
  const sequenceStepCTOs: SequenceStepCTO[] = SequenceStepRepository.findAll().map(
    createSequenceStepCTO
  );

  return { sequenceTO: sequence!, sequenceStepCTOs: sequenceStepCTOs };
};

const createSequenceStepCTO = (
  sequenceStepTO: SequenceStepTO
): SequenceStepCTO => {
  CheckHelper.nullCheck(sequenceStepTO, "sequenceStepTO");
  const sourceComponentTO: ComponentTO | undefined = ComponentRepository.find(
    sequenceStepTO.sourceComponentFk
  );
  CheckHelper.nullCheck(sourceComponentTO, "sourceComponentTO");
  const sourceComponentCTO: ComponentCTO = createComponentCTO(
    sourceComponentTO
  );

  const targetComponentTO: ComponentTO | undefined = ComponentRepository.find(
    sequenceStepTO.targetComponentFk
  );
  CheckHelper.nullCheck(targetComponentTO, "targetComponnetTO");
  const targetComponentCTO: ComponentCTO = createComponentCTO(
    targetComponentTO
  );

  const componentDataTOs: ComponentDataTO[] = ComponentDataRepository.findAll().filter(
    (componentData) => componentData.sequenceStepFk === sequenceStepTO.id
  );
  const componentDataCTOs: ComponentDataCTO[] = componentDataTOs.map(
    createComponentDataCTO
  );

  return {
    componentCTOSource: sourceComponentCTO,
    componentCTOTarget: targetComponentCTO,
    step: sequenceStepTO,
    componentDataCTOs: componentDataCTOs,
  };
};

const createComponentDataCTO = (
  componentData: ComponentDataTO
): ComponentDataCTO => {
  CheckHelper.nullCheck(componentData, "componentData");
  const component: ComponentTO | undefined = ComponentRepository.find(
    componentData.componentFk
  );
  CheckHelper.nullCheck(component, "component");
  const data: DataTO = DataRepository.find(componentData.dataFk)!;
  return {
    componentDataTO: componentData,
    componentTO: component!,
    dataTO: data,
  };
};
