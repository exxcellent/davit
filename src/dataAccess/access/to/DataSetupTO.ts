import { AbstractTO } from "./AbstractTO";
import { InitData } from "./InitDataTO";

export class DataSetupTO extends AbstractTO {
  constructor(public name = "", public initDatas: InitData[] = []) {
    super();
  }
}
