import { DataCTO } from "../access/cto/DataCTO";
import { GeometricalDataCTO } from "../access/cto/GeometraicalDataCTO";
import { DataTO } from "../access/to/DataTO";
import { DataRepository } from "../repositories/DataRepository";
import { CheckHelper } from "../util/CheckHelper";
import { TechnicalDataAccessService } from "./TechnicalDataAccessService";

export const DataDataAccessService = {
  find(id: number): DataTO | undefined {
    return DataRepository.find(id);
  },
  findAll(): DataCTO[] {
    return DataRepository.findAll().map((data) => createDataCTO(data));
  },

  saveCTO(dataCTO: DataCTO) {
    CheckHelper.nullCheck(dataCTO, "dataCTO");
    // TODO: refactor
    // update FK's
    const savedGeometricalData = TechnicalDataAccessService.saveGeometricalData(
      dataCTO.geometricalData
    );
    dataCTO.data.geometricalDataFk = savedGeometricalData.geometricalData.id;
    const savedData = DataRepository.save(dataCTO.data);
    return {
      data: savedData,
      geometricalData: savedGeometricalData,
    };
  },
};

// TODO ist export hier gut?
export const createDataCTO = (data: DataTO | undefined): DataCTO => {
  CheckHelper.nullCheck(data, "data");
  let geometricalData:
    | GeometricalDataCTO
    | undefined = TechnicalDataAccessService.findGeometricalDataCTO(
    data!.geometricalDataFk!
  );
  CheckHelper.nullCheck(geometricalData, "geometricalData");
  return {
    data: data!,
    geometricalData: geometricalData!,
  };
};
