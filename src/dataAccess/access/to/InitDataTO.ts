import { AbstractTO } from "./AbstractTO";

export class InitData extends AbstractTO {
  constructor(public componentFk = -1, public dataFk = -1) {
    super();
  }
}
