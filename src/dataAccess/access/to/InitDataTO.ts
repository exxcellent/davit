import { AbstractTO } from './AbstractTO';

export class InitDataTO extends AbstractTO {
  constructor(public componentFk = -1, public dataFk = -1, public instanceFk = -1, public dataSetupFk = -1) {
    super();
  }
}
