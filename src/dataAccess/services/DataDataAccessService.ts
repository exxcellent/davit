import { DataTO } from "../access/to/DataTO";
import { DataRepository } from "../repositories/DataRepository";

export const DataDataAccessService = {
  find(id: number): DataTO | undefined {
    return DataRepository.find(id);
  },
};
