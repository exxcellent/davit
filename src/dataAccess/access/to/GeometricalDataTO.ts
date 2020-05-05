import { AbstractTO } from "./AbstractTO";

export class GeometricalDataTO implements AbstractTO {
  constructor(
    public id: number = -1,
    public width: number = 150,
    public height: number = 150,
    public positionFk: number = -1
  ) {}
}
