import { AbstractTO } from "./AbstractTO";

export class PositionTO implements AbstractTO {
  constructor(
    public id: number = -1,
    public x: number = 10,
    public y: number = 10
  ) {}
}
