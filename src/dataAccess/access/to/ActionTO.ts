import { ActionType } from '../types/ActionType';
import { AbstractTO } from './AbstractTO';

export class ActionTO extends AbstractTO {
  constructor(
    public sequenceStepFk = -1,
    public receivingComponentFk = -1,
    public sendingComponentFk = -1,
    public dataFk = -1,
    public instanceFk = -1,
    public actionType = ActionType.ADD,
  ) {
    super();
  }
}
