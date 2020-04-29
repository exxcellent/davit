import { ComponentDataTO } from "./ComponentDataTO";
import { ComponentTO } from "./ComponentTO";
import { DataTO } from "./DataTO";
import { DesignTO } from "./DesignTO";
import { GeometricalDataTO } from "./GeometricalDataTO";
import { PositionTO } from "./PositionTO";
import { SequenceStepTO } from "./SequenceStepTO";
import { SequenceTO } from "./SequenceTO";

export interface StoreTO {
  // Component
  components: ComponentTO[];
  // Technical
  geometricalDatas: GeometricalDataTO[];
  positions: PositionTO[];
  designs: DesignTO[];
  // Sequence
  sequences: SequenceTO[];
  steps: SequenceStepTO[];
  componentDatas: ComponentDataTO[];
  // Data
  datas: DataTO[];
}
