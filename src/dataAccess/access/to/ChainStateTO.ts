import { AbstractTO } from "./AbstractTO";

export class ChainStateTO extends AbstractTO {
    constructor(
        public chainFk: number = -1,
        public label: string = "",
        public isState: boolean = true,
    ) {
        super();
    }
}
