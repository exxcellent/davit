import { GoTo, GoToTypes } from "../types/GoToType";
import { AbstractTO } from "./AbstractTO";

export class DecisionTO extends AbstractTO {
  constructor(
    public name: string = "",
    public sequenceFk: number = -1,
    public componentFk: number = -1,
    public has: boolean = true,
    public dataFks: number[] = [],
    public ifGoTo: GoTo = { type: GoToTypes.FIN },
    public elseGoTo: GoTo = { type: GoToTypes.ERROR },
    public root: boolean = false
  ) {
    super();
  }
}