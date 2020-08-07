import { AbstractTO } from "./AbstractTO";

export class ComponentTO extends AbstractTO {
  constructor(
    public name: string = "",
    public geometricalDataFk: number = -1,
    public designFk: number = -1,
    public groupFks: number = -1
  ) {
    super();
  }
}