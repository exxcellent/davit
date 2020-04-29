import { AbstractTO } from "./AbstractTO";

export class ComponentTO implements AbstractTO {
  constructor(
    public name: string = "",
    public id: number = -1,
    public geometricalDataFk: number = -1,
    public designFk: number = -1
  ) {}
}
