import { AbstractTO } from "./AbstractTO";

export class SequenceTO implements AbstractTO {
  constructor(public name: string = "", public id: number = -1) {}
}
