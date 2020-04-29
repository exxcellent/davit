import { AbstractTO } from "./AbstractTO";

export class GeometricalDataTO implements AbstractTO {
  constructor(
    public id: number = -1,
    public width: number = 150,
    public height: number = 150,
    public positionFk: number = -1
  ) {}
}
// export type GeometricalDataJson = {
//   id: number;
//   width: number;
//   height: number;
//   positionFk: number;
// };

// export class GeometricalDataBuilder {
//   private json: GeometricalDataJson;

//   constructor(geomatricalData?: GeometricalDataTO) {
//     this.json = geomatricalData
//       ? geomatricalData.toJSON()
//       : ({} as GeometricalDataJson);
//   }
//   id(id: number): GeometricalDataBuilder {
//     this.json.id = id;
//     return this;
//   }
//   width(width: number): GeometricalDataBuilder {
//     this.json.width = width;
//     return this;
//   }
//   height(height: number): GeometricalDataBuilder {
//     this.json.height = height;
//     return this;
//   }
//   positionFk(positionFk: number): GeometricalDataBuilder {
//     this.json.positionFk = positionFk;
//     return this;
//   }
//   build(): GeometricalDataTO {
//     return GeometricalDataTO.fromJSON(this.json);
//   }
// }

// export default class GeometricalDataTO {
//   private constructor(
//     readonly id: number,
//     readonly width: number,
//     readonly height: number,
//     readonly positionFk: number
//   ) {}

//   toJSON(): GeometricalDataJson {
//     return {
//       id: this.id,
//       width: this.width,
//       height: this.height,
//       positionFk: this.positionFk,
//     };
//   }

//   static fromJSON(json: GeometricalDataJson): GeometricalDataTO {
//     return new GeometricalDataTO(
//       json.id,
//       json.width,
//       json.height,
//       json.positionFk
//     );
//   }
//   static builder(geomatricalData?: GeometricalDataTO): GeometricalDataBuilder {
//     return new GeometricalDataBuilder(geomatricalData);
//   }
//}
