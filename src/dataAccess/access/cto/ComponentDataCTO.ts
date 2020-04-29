import { ComponentDataTO } from "../to/ComponentDataTO";
import { ComponentTO } from "../to/ComponentTO";
import { DataTO } from "../to/DataTO";

export class ComponentDataCTO {
  constructor(
    public componentDataTO: ComponentDataTO = new ComponentDataTO(),
    public componentTO: ComponentTO = new ComponentTO(),
    public dataTO: DataTO = new DataTO()
  ) {}
}
