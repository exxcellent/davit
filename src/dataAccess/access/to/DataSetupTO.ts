import { AbstractTO } from "./AbstractTO";

export class DataSetupTO extends AbstractTO {
    constructor(public name = "") {
        super();
    }
}
