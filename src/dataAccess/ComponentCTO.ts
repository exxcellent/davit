import PositionTO from "./PositionTO";
import DesignTO from "./DesignTO";
import GeometricalDataTO from "./GeometricalDataTO";
import ComponentTO from "./ComponentTO";

export interface ComponentCTO {
  componentTO: ComponentTO | undefined;
  geometricalData: GeometricalDataTO | undefined;
  position: PositionTO | undefined;
  design: DesignTO | undefined;
}
