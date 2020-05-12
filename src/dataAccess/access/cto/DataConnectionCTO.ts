import { DataConnectionTO } from "../to/DataConnectionTO";
import { DataTO } from "../to/DataTO";

export class DataConnectionCTO {
  constructor(
    public dataConnectionTO: DataConnectionTO = new DataConnectionTO(),
    public data1: DataTO = new DataTO(),
    public data2: DataTO = new DataTO()
  ) {}
}
