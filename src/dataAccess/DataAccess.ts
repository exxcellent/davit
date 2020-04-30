import { ComponentCTO } from "./access/cto/ComponentCTO";
import { SequenceCTO } from "./access/cto/SequenceCTO";
import { SequenceTO } from "./access/to/SequenceTO";
import { DataAccessResponse } from "./DataAccessResponse";
import dataStore from "./DataStore";
import { ComponentDataAccessService } from "./services/ComponentDataAccessService";
import { SequenceDataAccessService } from "./services/SequenceDataAccessService";

export const DataAccess = {
  findAllComponents(): DataAccessResponse<ComponentCTO[]> {
    return makeTransactional(ComponentDataAccessService.findAll);
  },

  saveComponentCTO(component: ComponentCTO): DataAccessResponse<ComponentCTO> {
    return makeTransactional(() => ComponentDataAccessService.save(component));
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
};

function makeTransactional<T>(callback: () => T): DataAccessResponse<T> {
  let response: DataAccessResponse<T> = {
    object: {} as T,
    message: "",
    code: 500,
  };
  try {
    response.object = JSON.parse(JSON.stringify(callback()));
    response.code = 200;
    dataStore.commitChanges();
  } catch (error) {
    console.warn(error);
    response.message = error.message;
    dataStore.roleBack();
  }
  return response;
}
