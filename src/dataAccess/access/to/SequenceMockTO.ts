import { AbstractTO } from "./AbstractTO";

export class SequenceMockTO extends AbstractTO {
    constructor(
        public sequenceFk: number = -1,
        public label: string = "",
        public isMockCondition: boolean = true,
    ) {
        super();
    }
}
