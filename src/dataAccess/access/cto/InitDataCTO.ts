import { InitDataTO } from "../to/InitDataTO";
import { ComponentCTO } from "./ComponentCTO";
import { DataCTO } from "./DataCTO";

export class InitDataCTO {
  constructor(
    public initData: InitDataTO = new InitDataTO(),
    public component: ComponentCTO = new ComponentCTO(),
    public data: DataCTO = new DataCTO()
  ) {}
}
