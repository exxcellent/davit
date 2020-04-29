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
import { SequenceRepository } from "../repositories/SequenceRepository";
import { SequenceStepRepository } from "../repositories/SequenceStepRepository";
import { CheckHelper } from "../util/CheckHelper";
import { ComponentDataAccessService } from "./ComponentDataAccessService";
import { DataDataAccessService } from "./DataDataAccessService";

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
  const sequenceStepCTOs: SequenceStepCTO[] = SequenceStepRepository.findAllForSequence(
    sequence!.id
  ).map(createSequenceStepCTO);

  return { sequenceTO: sequence!, sequenceStepCTOs: sequenceStepCTOs };
};

const createSequenceStepCTO = (
  sequenceStepTO: SequenceStepTO
): SequenceStepCTO => {
  CheckHelper.nullCheck(sequenceStepTO, "sequenceStepTO");
  const sourceComponentCTO: ComponentCTO = ComponentDataAccessService.findCTO(
    sequenceStepTO.sourceComponentFk
  );
  const targetComponentCTO: ComponentCTO = ComponentDataAccessService.findCTO(
    sequenceStepTO.targetComponentFk
  );

  const componentDataTOs: ComponentDataTO[] = ComponentDataRepository.findAllForStep(
    sequenceStepTO.id
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
  const component: ComponentTO | undefined = ComponentDataAccessService.find(
    componentData.componentFk
  );
  CheckHelper.nullCheck(component, "component");
  const data: DataTO | undefined = DataDataAccessService.find(
    componentData.dataFk
  );
  CheckHelper.nullCheck(data, "data");
  return {
    componentDataTO: componentData,
    componentTO: component!,
    dataTO: data!,
  };
};
