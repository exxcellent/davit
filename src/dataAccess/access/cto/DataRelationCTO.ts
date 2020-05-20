import { DataRelationTO } from "../to/DataRelationTO";
import { DataCTO } from "./DataCTO";

export class DataRelationCTO {
  constructor(
    public dataCTO1: DataCTO = new DataCTO(),
    public dataCTO2: DataCTO = new DataCTO(),
    public dataRelationTO: DataRelationTO = new DataRelationTO()
  ) {}
}
