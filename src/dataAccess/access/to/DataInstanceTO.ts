import { AbstractTO } from "./AbstractTO";

export class DataInstanceTO extends AbstractTO {
  constructor(public name: string = "", public dataFk: number = -1) {
    super();
  }
}
