import { ActionType } from '../types/ActionType';
import { AbstractTO } from './AbstractTO';

export class ActionTO extends AbstractTO {
  constructor(
    public sequenceStepFk = -1,
    public receivingActorFk = -1,
    public sendingActorFk = -1,
    public dataFk = -1,
    public instanceFk = -1,
    public actionType = ActionType.ADD,
  ) {
    super();
  }
}
