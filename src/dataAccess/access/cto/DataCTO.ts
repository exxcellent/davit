import { DataInstanceTO } from "../to/DataInstanceTO";
import { DataTO } from "../to/DataTO";
import { GeometricalDataCTO } from "./GeometraicalDataCTO";

export class DataCTO {
  constructor(
    public data: DataTO = new DataTO(),
    public instances: DataInstanceTO[] = [],
    public geometricalData: GeometricalDataCTO = new GeometricalDataCTO()
  ) {}
}
