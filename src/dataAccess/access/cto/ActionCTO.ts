import { ActionTO } from "../to/ActionTO";
import { ComponentTO } from "../to/ComponentTO";
import { DataTO } from "../to/DataTO";

export class ActionCTO {
  constructor(
    public actionTO: ActionTO = new ActionTO(),
    public componentTO: ComponentTO = new ComponentTO(),
    public dataTO: DataTO = new DataTO()
  ) {}
}
