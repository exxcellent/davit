import { SequenceStepTO } from "../to/SequenceStepTO";
import { ComponentCTO } from "./ComponentCTO";
import { ComponentDataCTO } from "./ComponentDataCTO";

export class SequenceStepCTO {
  constructor(
    public componentCTOSource: ComponentCTO = new ComponentCTO(),
    public componentCTOTarget: ComponentCTO = new ComponentCTO(),
    public step: SequenceStepTO = new SequenceStepTO(),
    public componentDataCTOs: ComponentDataCTO[] = []
  ) {}
}
