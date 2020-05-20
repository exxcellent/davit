import { ComponentDataTO } from "../to/ComponentDataTO";
import { ComponentTO } from "../to/ComponentTO";
import { DataRelationTO } from "../to/DataRelationTO";
import { DataTO } from "../to/DataTO";
import { DesignTO } from "../to/DesignTO";
import { GeometricalDataTO } from "../to/GeometricalDataTO";
import { PositionTO } from "../to/PositionTO";
import { SequenceStepTO } from "../to/SequenceStepTO";
import { SequenceTO } from "../to/SequenceTO";

export class DataStoreCTO {
  constructor(
    // Components
    public components = new Map<number, ComponentTO>(),
    // Technical
    public positions = new Map<number, PositionTO>(),
    public designs = new Map<number, DesignTO>(),
    public geometricalDatas = new Map<number, GeometricalDataTO>(),
    // Sequence
    public sequences = new Map<number, SequenceTO>(),
    public steps = new Map<number, SequenceStepTO>(),
    public componentDatas = new Map<number, ComponentDataTO>(),
    // Data
    public datas = new Map<number, DataTO>(),
    public dataConnections = new Map<number, DataRelationTO>()
  ) {}
}
