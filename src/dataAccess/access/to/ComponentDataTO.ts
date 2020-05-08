import { ComponentDataState } from "../types/ComponentDataState";
import { AbstractTO } from "./AbstractTO";

export class ComponentDataTO extends AbstractTO {
  constructor(
    public sequenceStepFk = -1,
    public componentFk = -1,
    public dataFk = -1,
    public componentDataState = ComponentDataState.NEW
  ) {
    super();
  }
}
