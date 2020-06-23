import { DataSetupTO } from "../to/DataSetupTO";
import { InitDataCTO } from "./InitDataCTO";

export class DataSetupCTO {
  constructor(public initDatas: InitDataCTO[] = [], public dataSetup: DataSetupTO = new DataSetupTO()) {}
}
