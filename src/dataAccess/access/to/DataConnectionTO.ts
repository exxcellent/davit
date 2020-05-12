import { AbstractTO } from "./AbstractTO";

export class DataConnectionTO extends AbstractTO {
  constructor(public data1Fk: number = -1, public data2Fk: number = -1) {
    super();
  }
}
