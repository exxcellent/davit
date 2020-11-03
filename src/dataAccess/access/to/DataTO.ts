import {AbstractTO} from './AbstractTO';
import {DataInstanceTO} from './DataInstanceTO';

export class DataTO extends AbstractTO {
  constructor(
    public name: string = '',
    public geometricalDataFk: number = -1,
    public dataConnectionFks: number[] = [],
    public instances: DataInstanceTO[] = [],
  ) {
    super();
    // add default instance
  }
}
