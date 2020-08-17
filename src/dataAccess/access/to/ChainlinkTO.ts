import { AbstractTO } from "./AbstractTO";

export class ChainlinkTO extends AbstractTO {
  constructor(public sequenceFk: number = -1, public dataSetupFk: number = -1) {
    super();
  }
}
