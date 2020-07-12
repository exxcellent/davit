import { AbstractTO } from "./AbstractTO";

export class GeometricalDataTO extends AbstractTO {
  constructor(
    public width: number = 150,
    public height: number = 150,
    public positionFk: number = -1
  ) {
    super();
  }
}
