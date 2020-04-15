import ComponentTO from "./ComponentTO";
import DesignTO from "./DesignTO";
import PositionTO from "./PositionTO";
import GeometricalDataTO from "./GeometricalDataTO";

const { Map } = require("immutable");

export interface DataStoreCTO {
  components: Map<number, ComponentTO>;
  designs: Map<number, DesignTO>;
  positions: Map<number, PositionTO>;
  geometricalData: Map<number, GeometricalDataTO>;
}
