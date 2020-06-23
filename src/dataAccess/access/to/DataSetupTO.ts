import { AbstractTO } from "./AbstractTO";
import { InitDataTO } from "./InitDataTO";

export class DataSetupTO extends AbstractTO {
  constructor(public name = "", public initDatas: InitDataTO[] = []) {
    super();
  }
}
