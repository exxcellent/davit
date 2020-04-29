import { ComponentDataState } from "../types/ComponentDataState";

export class ComponentDataTO {
  constructor(
    public id = -1,
    public sequenceStepFk = -1,
    public componentFk = -1,
    public dataFk = -1,
    public componentDataState = ComponentDataState.NEW
  ) {}
}
