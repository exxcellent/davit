import { ComponentTO } from '../to/ActorTO';
import { DesignTO } from '../to/DesignTO';
import { GeometricalDataCTO } from './GeometraicalDataCTO';

export class ComponentCTO {
  constructor(
    public component: ComponentTO = new ComponentTO(),
    public geometricalData: GeometricalDataCTO = new GeometricalDataCTO(),
    public design: DesignTO = new DesignTO()
  ) {}
}
