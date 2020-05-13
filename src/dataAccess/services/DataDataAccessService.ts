import { DataCTO } from "../access/cto/DataCTO";
import { GeometricalDataCTO } from "../access/cto/GeometraicalDataCTO";
import { DataConnectionTO } from "../access/to/DataConnectionTO";
import { DataTO } from "../access/to/DataTO";
import { DataConnectionRepository } from "../repositories/DataConnectionRepository";
import { DataRepository } from "../repositories/DataRepository";
import { CheckHelper } from "../util/CheckHelper";
import { TechnicalDataAccessService } from "./TechnicalDataAccessService";

export const DataDataAccessService = {
  findData(id: number): DataTO | undefined {
    return DataRepository.find(id);
  },

  findAllDatas(): DataCTO[] {
    return DataRepository.findAll().map((data) => createDataCTO(data));
  },

  saveDataCTO(dataCTO: DataCTO): DataCTO {
    CheckHelper.nullCheck(dataCTO, "dataCTO");
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

  findAllDataConnections(): DataConnectionTO[] {
    return DataConnectionRepository.findAll();
  },

  deleteDataCTO(dataCTO: DataCTO): DataCTO {
    CheckHelper.nullCheck(dataCTO.geometricalData, "GeometricalDataCTO");
    CheckHelper.nullCheck(dataCTO.data, "DataTO");
    TechnicalDataAccessService.deleteGeometricalDataCTO(
      dataCTO.geometricalData
    );
    DataRepository.delete(dataCTO.data);
    return dataCTO;
  },
};

const createDataCTO = (data: DataTO | undefined): DataCTO => {
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
