import { GeometricalDataCTO } from "../access/cto/GeometraicalDataCTO";
import { DesignTO } from "../access/to/DesignTO";
import { GeometricalDataTO } from "../access/to/GeometricalDataTO";
import { PositionTO } from "../access/to/PositionTO";
import { DesignRepository } from "../repositories/DesignRepository";
import { GeometricalDataRepository } from "../repositories/GeometricalDataRepository";
import { PositionRepository } from "../repositories/PositionRepository";
import { CheckHelper } from "../util/CheckHelper";

export const TechnicalDataAccessService = {
  findPosition(id: number): PositionTO | undefined {
    return PositionRepository.find(id);
  },

  findGeometricalDataCTO(id: number): GeometricalDataCTO | undefined {
    const geometricalData = GeometricalDataRepository.find(id);
    CheckHelper.nullCheck(geometricalData, "geometricalData");
    const position = PositionRepository.find(geometricalData!.positionFk!);
    CheckHelper.nullCheck(position, "position");
    return { geometricalData: geometricalData!, position: position! };
  },

  findGeometricalData(id: number): GeometricalDataTO | undefined {
    return GeometricalDataRepository.find(id);
  },

  findDesign(id: number): DesignTO | undefined {
    return DesignRepository.find(id);
  },

  saveGeometricalData(
    geometricalDataCTO: GeometricalDataCTO
  ): GeometricalDataCTO {
    CheckHelper.nullCheck(geometricalDataCTO, "geometricalDataCTO");
    CheckHelper.nullCheck(
      geometricalDataCTO.geometricalData,
      "geometricalData"
    );
    CheckHelper.nullCheck(geometricalDataCTO.position, "position");
    const savedPosition = PositionRepository.save(geometricalDataCTO.position);
    geometricalDataCTO.geometricalData.positionFk = savedPosition.id;
    const savedGeometricalData = GeometricalDataRepository.save(
      geometricalDataCTO.geometricalData
    );
    return {
      position: savedPosition,
      geometricalData: savedGeometricalData,
    };
  },

  saveDesign(design: DesignTO): DesignTO {
    CheckHelper.nullCheck(design, "design");
    return DesignRepository.save(design);
  },

  deleteGeometricalDataCTO(
    geometricalDataCTO: GeometricalDataCTO
  ): GeometricalDataCTO {
    CheckHelper.nullCheck(geometricalDataCTO, "geometricalDataCTO");
    const isdeletedPosition = PositionRepository.delete(
      geometricalDataCTO.position
    );
    const isDeletedGeoData = GeometricalDataRepository.delete(
      geometricalDataCTO.geometricalData
    );
    if (!(isdeletedPosition && isDeletedGeoData)) {
      // TODO: use intl id
      throw new Error("Couldn't delete");
    }
    return geometricalDataCTO;
  },

  deleteDesign(design: DesignTO): DesignTO {
    const isDeleted = DesignRepository.delete(design);
    if (!isDeleted) {
      // TODO: use intl id
      throw new Error("Couldn't delete");
    }
    return design;
  },
};
