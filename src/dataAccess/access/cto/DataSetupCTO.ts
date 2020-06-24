import { DataSetupTO } from "../to/DataSetupTO";
import { InitDataTO } from "../to/InitDataTO";

export class DataSetupCTO {
  constructor(public initDatas: InitDataTO[] = [], public dataSetup: DataSetupTO = new DataSetupTO()) {}
}
