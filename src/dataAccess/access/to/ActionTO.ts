import { ActionType } from "../types/ActionType";
import { AbstractTO } from "./AbstractTO";

export class ActionTO extends AbstractTO {
  constructor(
    public sequenceStepFk = -1,
    public componentFk = -1,
    public dataFk = -1,
    public actionType = ActionType.ADD,
    public sendingComponentFk = -1
  ) {
    super();
  }
}
