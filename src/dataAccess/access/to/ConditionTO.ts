import { AbstractTO } from "./AbstractTO";

export class ConditionTO extends AbstractTO {
  constructor(
    public name: string = "",
    public sequenceFk: number = -1,
    public componentFk: number = -1,
    public has: boolean = true,
    public dataFks: number[] = []
  ) {
    super();
  }
}
