import { ComponentCTO } from "./access/cto/ComponentCTO";
import { DataCTO } from "./access/cto/DataCTO";
import { SequenceCTO } from "./access/cto/SequenceCTO";
import { SequenceTO } from "./access/to/SequenceTO";
import { DataAccessResponse } from "./DataAccessResponse";
import dataStore from "./DataStore";
import { ComponentDataAccessService } from "./services/ComponentDataAccessService";
import { DataDataAccessService } from "./services/DataDataAccessService";
import { SequenceDataAccessService } from "./services/SequenceDataAccessService";

export const DataAccess = {
  storeFileData(fileData: string): DataAccessResponse<void> {
    let response: DataAccessResponse<void> = {
      object: undefined,
      message: "",
      code: 500,
    };
    try {
      dataStore.storeFileData(fileData);
      return { ...response, code: 200 };
    } catch (error) {
      return { ...response, message: error.message };
    }
  },

  findAllComponents(): DataAccessResponse<ComponentCTO[]> {
    return makeTransactional(ComponentDataAccessService.findAll);
  },

  saveComponentCTO(component: ComponentCTO): DataAccessResponse<ComponentCTO> {
    return makeTransactional(() =>
      ComponentDataAccessService.saveCTO(component)
    );
  },

  deleteComponentCTO(
    component: ComponentCTO
  ): DataAccessResponse<ComponentCTO> {
    return makeTransactional(() =>
      ComponentDataAccessService.delete(component)
    );
  },

  findAllSequences(): DataAccessResponse<SequenceTO[]> {
    return makeTransactional(SequenceDataAccessService.findAll);
  },

  findSequence(sequenceId: number): DataAccessResponse<SequenceCTO> {
    return makeTransactional(() => SequenceDataAccessService.find(sequenceId));
  },

  findAllDatas(): DataAccessResponse<DataCTO[]> {
    return makeTransactional(DataDataAccessService.findAll);
  },

  saveDataCTO(dataCTO: DataCTO): DataAccessResponse<DataCTO> {
    return makeTransactional(() => DataDataAccessService.saveCTO(dataCTO));
  },

  deleteDataCTO(dataCTO: DataCTO): DataAccessResponse<DataCTO> {
    return makeTransactional(() => DataDataAccessService.deleteCTO(dataCTO));
  },
};

function makeTransactional<T>(callback: () => T): DataAccessResponse<T> {
  let response: DataAccessResponse<T> = {
    object: {} as T,
    message: "",
    code: 500,
  };
  try {
    const object = callback();
    response.object =
      typeof object === "undefined"
        ? undefined
        : // : JSON.parse(JSON.stringify(callback()));
          JSON.parse(JSON.stringify(object));
    response.code = 200;
    dataStore.commitChanges();
  } catch (error) {
    console.warn(error);
    response.message = error.message;
    dataStore.roleBack();
  }
  return response;
}
