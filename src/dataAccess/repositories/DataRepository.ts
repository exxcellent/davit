import {DataInstanceTO} from '../access/to/DataInstanceTO';
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
    // check default instance
    if (dataTO.instances.find((inst) => inst.defaultInstance === true)) {
      dataTO.instances.find((inst) => inst.defaultInstance === true)!.name = dataTO.name;
    } else {
      // create missing default instance
      const defaultInstance: DataInstanceTO = new DataInstanceTO(dataTO.name, true);
      defaultInstance.id = DataAccessUtil.determineNewId(dataTO.instances);
      dataTO.instances.push(defaultInstance);
    }
    dataStore.getDataStore().datas.set(dataTO.id!, dataTO);
    return dataTO;
  },

  delete(dataTO: DataTO): DataTO {
    ConstraintsHelper.deleteDataConstraintCheck(dataTO.id, dataStore.getDataStore());
    const success = dataStore.getDataStore().datas.delete(dataTO.id!);
    if (!success) {
      throw new Error('dataAccess.repository.error.notExists');
    }
    return dataTO;
  },
};
