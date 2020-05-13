import { DataConnectionCTO } from "../access/cto/DataConnectionCTO";
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

  findAllDataConnections(): DataConnectionCTO[] {
    return DataConnectionRepository.findAll().map((dataConnection) =>
      createDataConnectionCTO(dataConnection)
    );
  },

  saveDataConnectionCTO(
    dataConnectionCTO: DataConnectionCTO
  ): DataConnectionCTO {
    CheckHelper.nullCheck(dataConnectionCTO, "dataConnectionCTO");
    const saveData1 = this.saveDataCTO(dataConnectionCTO.data1);
    CheckHelper.nullCheck(saveData1, "saveData1");
    const saveData2 = this.saveDataCTO(dataConnectionCTO.data2);
    CheckHelper.nullCheck(saveData2, "saveData2");
    const savedDataConnection = DataConnectionRepository.save(
      dataConnectionCTO.dataConnectionTO
    );
    return {
      dataConnectionTO: savedDataConnection,
      data1: saveData1,
      data2: saveData2,
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

const createDataCTO = (data: DataTO | undefined): DataCTO => {
  CheckHelper.nullCheck(data, "data");
  let geometricalData:
    | GeometricalDataCTO
    | undefined = TechnicalDataAccessService.findGeometricalDataCTO(
    data!.geometricalDataFk!
  );
  CheckHelper.nullCheck(geometricalData, "geometricalData");
  let dataConnections: DataConnectionCTO[] = [];
  if (data?.dataConnectionFks !== undefined) {
    for (let i = 0; i < data!.dataConnectionFks.length; i++) {
      let dataConnectionTO:
        | DataConnectionTO
        | undefined = DataConnectionRepository.find(data!.dataConnectionFks[i]);
      CheckHelper.nullCheck(dataConnectionTO, "dataConnectionTO");
      dataConnections.push(createDataConnectionCTO(dataConnectionTO!));
    }
  }
  return {
    data: data!,
    geometricalData: geometricalData!,
  };
};

const createDataConnectionCTO = (
  dataConnection: DataConnectionTO
): DataConnectionCTO => {
  CheckHelper.nullCheck(dataConnection, "dataConnection");
  const dataTO1: DataTO | undefined = DataDataAccessService.findData(
    dataConnection.data1Fk
  );
  CheckHelper.nullCheck(dataTO1, "data1");
  const dataTO2: DataTO | undefined = DataDataAccessService.findData(
    dataConnection.data2Fk
  );
  CheckHelper.nullCheck(dataTO2, "data2");
  const dataCTO1: DataCTO = createDataCTO(dataTO1);
  const dataCTO2: DataCTO = createDataCTO(dataTO2);
  return {
    dataConnectionTO: dataConnection,
    data1: dataCTO1,
    data2: dataCTO2,
  };
};
