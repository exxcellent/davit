import { DataConnectionTO } from "../to/DataConnectionTO";
import { DataCTO } from "./DataCTO";

export class DataConnectionCTO {
  constructor(
    public dataConnectionTO: DataConnectionTO = new DataConnectionTO(),
    public data1: DataCTO = new DataCTO(),
    public data2: DataCTO = new DataCTO()
  ) {}
}
