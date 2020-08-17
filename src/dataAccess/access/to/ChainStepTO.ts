import { GoTo, GoToTypes } from "../types/GoToType";
import { AbstractTO } from "./AbstractTO";

export class ChainStepTO extends AbstractTO {
  constructor(
    public name: string = "",
    public chainFk: number = -1,
    public sourceChainlinkFk = -1,
    public targetChainlinkFk = -1,
    public goto: GoTo = { type: GoToTypes.ERROR },
    public root: boolean = false
  ) {
    super();
  }
}
