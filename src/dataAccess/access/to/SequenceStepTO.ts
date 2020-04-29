import { AbstractTO } from "./AbstractTO";

export class SequenceStepTO implements AbstractTO {
  constructor(
    public id = -1,
    public name = "",
    public index = -1,
    public sequenceFk = -1,
    public sourceComponentFk = -1,
    public targetComponentFk = -1
  ) {}
}
