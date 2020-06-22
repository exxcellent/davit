import { SequenceStepTO } from "../to/SequenceStepTO";
import { ActionCTO } from "./ActionCTO";
import { ComponentCTO } from "./ComponentCTO";

export class SequenceStepCTO {
  constructor(
    public componentCTOSource: ComponentCTO = new ComponentCTO(),
    public componentCTOTarget: ComponentCTO = new ComponentCTO(),
    public squenceStepTO: SequenceStepTO = new SequenceStepTO(),
    public actions: ActionCTO[] = []
  ) {}
}
