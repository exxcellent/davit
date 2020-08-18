import { GoToChain, GoToTypesChain } from "../types/GoToTypeChain";
import { AbstractTO } from "./AbstractTO";

export class ChainDecisionTO extends AbstractTO {
  constructor(
    public name: string = "",
    public chainFk: number = -1,
    public has: boolean = true,
    public componentFk: number = -1,
    public dataFks: number[] = [],
    public ifGoTo: GoToChain = { type: GoToTypesChain.FIN },
    public elseGoTo: GoToChain = { type: GoToTypesChain.ERROR },
    public root: boolean = false
  ) {
    super();
  }
}
