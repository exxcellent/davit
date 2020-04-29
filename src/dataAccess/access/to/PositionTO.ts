import { AbstractTO } from "./AbstractTO";

export class PositionTO implements AbstractTO {
  constructor(
    public id: number = -1,
    public x: number = 10,
    public y: number = 10
  ) {}
}

// export type PositionJson = {
//   id: number;
//   x: number;
//   y: number;
// };

// export class PositionBuilder {
//   private json: PositionJson;

//   constructor(position?: PositionTO) {
//     this.json = position ? position.toJSON() : ({} as PositionJson);
//   }
//   id(id: number): PositionBuilder {
//     this.json.id = id;
//     return this;
//   }
//   x(x: number): PositionBuilder {
//     this.json.x = x;
//     return this;
//   }
//   y(y: number): PositionBuilder {
//     this.json.y = y;
//     return this;
//   }
//   build(): PositionTO {
//     return PositionTO.fromJSON(this.json);
//   }
// }

// export default class PositionTO {
//   private constructor(
//     readonly id: number,
//     readonly x: number,
//     readonly y: number
//   ) {}

//   toJSON(): PositionJson {
//     return {
//       id: this.id,
//       x: this.x,
//       y: this.y,
//     };
//   }

//   static fromJSON(json: PositionJson): PositionTO {
//     return new PositionTO(json.id, json.x, json.y);
//   }
//   static builder(position?: PositionTO): PositionBuilder {
//     return new PositionBuilder(position);
//   }
// }
