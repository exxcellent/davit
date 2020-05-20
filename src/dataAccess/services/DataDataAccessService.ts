import { DataCTO } from "../access/cto/DataCTO";
import { DataRelationCTO } from "../access/cto/DataRelationCTO";
import { GeometricalDataCTO } from "../access/cto/GeometraicalDataCTO";
import { DataRelationTO } from "../access/to/DataRelationTO";
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

  findAllDataRelationTOs(): DataRelationTO[] {
    return DataConnectionRepository.findAll();
  },

  findAllDataRelationCTOs(): DataRelationCTO[] {
    return DataDataAccessService.findAllDataRelationTOs().map(
      createDataRelationCTO
    );
  },

  saveDataRelation(dataRelation: DataRelationCTO): DataRelationCTO {
    CheckHelper.nullCheck(dataRelation, "dataRelation");
    const saveDataConnection = DataConnectionRepository.save(
      dataRelation.dataRelationTO
    );
    return {
      dataCTO1: dataRelation.dataCTO1,
      dataCTO2: dataRelation.dataCTO2,
      dataRelationTO: saveDataConnection,
    };
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

const createDataRelationCTO = (
  dataRelationTO: DataRelationTO
): DataRelationCTO => {
  CheckHelper.nullCheck(dataRelationTO, "DataRelationTO");
  const dataCTO1: DataCTO | undefined = createDataCTO(
    DataDataAccessService.findData(dataRelationTO.data1Fk)
  );
  CheckHelper.nullCheck(dataCTO1, "dataTO1");
  const dataCTO2: DataCTO | undefined = createDataCTO(
    DataDataAccessService.findData(dataRelationTO.data2Fk)
  );
  CheckHelper.nullCheck(dataCTO2, "dataTO2");
  return {
    dataCTO1: dataCTO1!,
    dataCTO2: dataCTO2!,
    dataRelationTO: dataRelationTO,
  };
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
