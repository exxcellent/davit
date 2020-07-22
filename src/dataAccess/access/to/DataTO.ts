import { AbstractTO } from "./AbstractTO";

export class DataTO extends AbstractTO {
  constructor(
    public name: string = "",
    public geometricalDataFk: number = -1,
    public dataConnectionFks: number[] = [],
    public inst: DataInstanceTO[] = []
  ) {
    super();
  }
}

export class DataInstanceTO extends AbstractTO {
  constructor(
    public name: string = "",
    public dataFk: number = -1,
  ) {
    super();
  }
}

export const getDataAndInstanceIds = (concatedId: number): { dataId: number, instanceId: number } => {
  const instanceID = concatedId % DATA_INSTANCE_ID_FACTOR;
  const dataID = (concatedId - instanceID) / DATA_INSTANCE_ID_FACTOR;
  return { dataId: dataID, instanceId: instanceID };
}

export const DATA_INSTANCE_ID_FACTOR = 100000;
