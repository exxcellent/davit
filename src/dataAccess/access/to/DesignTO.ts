import { AbstractTO } from "./AbstractTO";

export class DesignTO implements AbstractTO {
  constructor(public color: string = "#3498db", public id: number = -1) {}
}

// export type DesignJson = {
//   color: string;
//   id: number;
// };

// export class DesignBuilder {
//   private json: DesignJson;

//   constructor(design?: DesignTO) {
//     this.json = design ? design.toJSON() : ({} as DesignJson);
//   }
//   color(color: string): DesignBuilder {
//     this.json.color = color;
//     return this;
//   }
//   id(id: number): DesignBuilder {
//     this.json.id = id;
//     return this;
//   }
//   build(): DesignTO {
//     return DesignTO.fromJSON(this.json);
//   }
// }

// export default class DesignTO {
//   private constructor(readonly color: string, readonly id: number) {}

//   toJSON(): DesignJson {
//     return {
//       color: this.color,
//       id: this.id,
//     };
//   }

//   static fromJSON(json: DesignJson): DesignTO {
//     return new DesignTO(json.color, json.id);
//   }
//   static builder(design?: DesignTO): DesignBuilder {
//     return new DesignBuilder(design);
//   }
// }
