import { ConditionTO } from "../to/ConditionTO";
import { SequenceTO } from "../to/SequenceTO";
import { SequenceStepCTO } from "./SequenceStepCTO";

export class SequenceCTO {
  constructor(
    public sequenceTO: SequenceTO = new SequenceTO(),
    public sequenceStepCTOs: SequenceStepCTO[] = [],
    public conditions: ConditionTO[] = []
  ) {}
}
