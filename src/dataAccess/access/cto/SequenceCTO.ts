import { SequenceTO } from "../to/SequenceTO";
import { SequenceStepCTO } from "./SequenceStepCTO";

export class SequenceCTO {
  constructor(
    public sequenceTO: SequenceTO = new SequenceTO(),
    public sequenceStepCTOs: SequenceStepCTO[] = []
  ) {}
}
