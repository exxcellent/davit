import { AbstractTO } from "./AbstractTO";

export class ChainMockTO extends AbstractTO {
    constructor(
        public chainFk: number = -1,
        public label: string = "",
        public isMockCondition: boolean = true,
    ) {
        super();
    }
}
