import { AbstractTO } from "./AbstractTO";

export enum Direction {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  TOP = "TOP",
  BOTTOM = "BOTTOM",
}

export enum RelationType {
  DEFAULT = "DEFAULT",
}

export class DataConnectionTO extends AbstractTO {
  constructor(
    public data1Fk: number = -1,
    public data2Fk: number = -1,
    public label1: string = "",
    public label2: string = "",
    public direction: Direction = Direction.RIGHT,
    public type: RelationType = RelationType.DEFAULT
  ) {
    super();
  }
}
