import { ActorTO } from '../access/to/ActorTO';
import { ConstraintsHelper } from '../ConstraintsHelper';
import dataStore from '../DataStore';
import { CheckHelper } from '../util/CheckHelper';
import { DataAccessUtil } from '../util/DataAccessUtil';

export const ComponentRepository = {
  find(id: number): ActorTO | undefined {
    return dataStore.getDataStore().components.get(id);
  },

  findAll(): ActorTO[] {
    return Array.from(dataStore.getDataStore().components.values());
  },

  delete(component: ActorTO): ActorTO {
    ConstraintsHelper.deleteComponentConstraintCheck(component.id, dataStore.getDataStore());
    let success = dataStore.getDataStore().components.delete(component.id!);
    if (!success) {
      throw new Error("dataAccess.repository.error.notExists");
    }
    return component;
  },

  save(component: ActorTO): ActorTO {
    CheckHelper.nullCheck(component, "component");
    let componentTO: ActorTO;
    if (component.id === -1) {
      componentTO = {
        ...component,
        id: DataAccessUtil.determineNewId(this.findAll()),
      };
      console.info("set new component id: " + componentTO.id);
    } else {
      componentTO = { ...component };
    }
    dataStore.getDataStore().components.set(componentTO.id!, componentTO);
    return componentTO;
  },
};
