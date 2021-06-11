import { ChainDecisionTO } from "../to/ChainDecisionTO";
import { ChainStateTO } from "../to/ChainStateTO";
import { ChainTO } from "../to/ChainTO";
import { ChainlinkCTO } from "./ChainlinkCTO";

export class ChainCTO {
    constructor(
        public chain: ChainTO = new ChainTO(),
        public links: ChainlinkCTO[] = [],
        public decisions: ChainDecisionTO[] = [],
        public chainStates: ChainStateTO[] = [],
    ) {
    }
}
