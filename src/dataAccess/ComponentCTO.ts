import PositionTO from "./PositionTO";
import DesignTO from "./DesignTO";
import GeometricalDataTO from "./GeometricalDataTO";
import ComponentTO from "./ComponentTO";

export interface ComponentCTO {
  component: ComponentTO;
  geometricalData: GeometricalDataTO;
  position: PositionTO;
  design: DesignTO;
}
