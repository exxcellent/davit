import { AbstractTO } from './AbstractTO';

export class DataInstanceTO extends AbstractTO{
  constructor(public name: string = "", public defaultInstance: boolean = false) {
    super();
  }
}
