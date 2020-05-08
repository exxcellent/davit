import { ComponentDataTO } from "../to/ComponentDataTO";
import { ComponentTO } from "../to/ComponentTO";
import { DataTO } from "../to/DataTO";
import { DesignTO } from "../to/DesignTO";
import { GeometricalDataTO } from "../to/GeometricalDataTO";
import { PositionTO } from "../to/PositionTO";
import { SequenceStepTO } from "../to/SequenceStepTO";
import { SequenceTO } from "../to/SequenceTO";

// export type DataStoreCTO = {
//   // Components
//   components: Map<number, ComponentTO>;
//   // Technical
//   designs: Map<number, DesignTO>;
//   positions: Map<number, PositionTO>;
//   geometricalDatas: Map<number, GeometricalDataTO>;
//   // Sequence
//   sequences: Map<number, SequenceTO>;
//   steps: Map<number, SequenceStepTO>;
//   componentDatas: Map<number, ComponentDataTO>;
//   // Data
//   datas: Map<number, DataTO>;
// };

export class DataStoreCTO {
  constructor(
    public components = new Map<number, ComponentTO>(),
    public positions = new Map<number, PositionTO>(),
    public designs = new Map<number, DesignTO>(),
    public geometricalDatas = new Map<number, GeometricalDataTO>(),
    public sequences = new Map<number, SequenceTO>(),
    public steps = new Map<number, SequenceStepTO>(),
    public componentDatas = new Map<number, ComponentDataTO>(),
    public datas = new Map<number, DataTO>()
  ) {}
}
