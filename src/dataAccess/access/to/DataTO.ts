import { AbstractTO } from "./AbstractTO";
import { DataInstanceTO } from "./DataInstanceTO";

export class DataTO extends AbstractTO {
  constructor(
    public name: string = "",
    public geometricalDataFk: number = -1,
    public dataConnectionFks: number[] = [],
    public inst: DataInstanceTO[] = []
  ) {
    super();
    inst.push({ id: -1, dataFk: this.id, name: this.name });
  }
}

export const getDataAndInstanceIds = (concatedId: number): { dataId: number; instanceId?: number } => {
  if (concatedId < DATA_INSTANCE_ID_FACTOR) {
    return { dataId: concatedId };
  } else {
    const instanceID = concatedId % DATA_INSTANCE_ID_FACTOR;
    const dataID = (concatedId - instanceID) / DATA_INSTANCE_ID_FACTOR;
    return { dataId: dataID, instanceId: instanceID };
  }
};

export const DATA_INSTANCE_ID_FACTOR = 100000;
