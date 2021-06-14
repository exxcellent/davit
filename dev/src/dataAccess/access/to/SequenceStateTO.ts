import { AbstractTO } from "./AbstractTO";

export class SequenceStateTO extends AbstractTO {
    constructor(
        public sequenceFk: number = -1,
        public label: string = "",
        public isState: boolean = true,
    ) {
        super();
    }
}
