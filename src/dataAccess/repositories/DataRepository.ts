import {DataTO} from '../access/to/DataTO';
import {ConstraintsHelper} from '../ConstraintsHelper';
import dataStore from '../DataStore';
import {CheckHelper} from '../util/CheckHelper';
import {DataAccessUtil} from '../util/DataAccessUtil';

export const DataRepository = {
  find(dataId: number): DataTO | undefined {
    return dataStore.getDataStore().datas.get(dataId);
  },

  findAll(): DataTO[] {
    return Array.from(dataStore.getDataStore().datas.values());
  },

  save(data: DataTO) {
    CheckHelper.nullCheck(data, 'data');
    let dataTO: DataTO;
    if (data.id === -1) {
      dataTO = {
        ...data,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
    } else {
      dataTO = {...data};
    }

    if (data.instances.length <= 0) {
      throw new Error(`dataTO with id: ${data.id} has no instances!`);
    }

    dataStore.getDataStore().datas.set(dataTO.id!, dataTO);
    return dataTO;
  },

  delete(dataTO: DataTO): DataTO {
    ConstraintsHelper.deleteDataConstraintCheck(dataTO.id, dataStore.getDataStore());
    dataTO.instances.forEach((instance) => ConstraintsHelper.deleteDataInstanceConstraintCheck(instance.id, dataStore.getDataStore()));
    const success = dataStore.getDataStore().datas.delete(dataTO.id!);
    if (!success) {
      throw new Error('dataAccess.repository.error.notExists');
    }
    return dataTO;
  },
};
