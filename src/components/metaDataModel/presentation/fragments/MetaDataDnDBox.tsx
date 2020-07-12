import { motion } from "framer-motion";
import React, { FunctionComponent, useRef } from "react";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { GeometricalDataCTO } from "../../../../dataAccess/access/cto/GeometraicalDataCTO";
import { DataRelationTO } from "../../../../dataAccess/access/to/DataRelationTO";
import { Carv2Util } from "../../../../utils/Carv2Util";
import { ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { createCornerConnection } from "../../../common/fragments/svg/Carv2Path";
import { createMetaDataFragment } from "./MetaDataFragment";

interface MetaDataDnDBox {
  dataCTOs: DataCTO[];
  dataCTOToEdit: DataCTO | null;
  dataRelationToEdit: DataRelationTO | null;
  dataRelations: DataRelationTO[];
  componentDatas: ViewFragmentProps[];
  onSaveCallBack: (dataCTO: DataCTO) => void;
  onClick: (dataId: number) => void;
}

export const MetaDataDnDBox: FunctionComponent<MetaDataDnDBox> = (props) => {
  const { dataCTOs, dataCTOToEdit, onSaveCallBack, dataRelations, dataRelationToEdit, componentDatas, onClick } = props;

  const constraintsRef = useRef(null);

  const onPositionUpdate = (x: number, y: number, positionId: number) => {
    const dataCTO = dataCTOs.find((dataCTO) => dataCTO.geometricalData.position.id === positionId);
    if (dataCTO) {
      let copyDataCTO: DataCTO = Carv2Util.deepCopy(dataCTO);
      copyDataCTO.geometricalData.position.x = x;
      copyDataCTO.geometricalData.position.y = y;
      onSaveCallBack(copyDataCTO);
    }
  };

  const createConnections = () => {
    return dataRelations.map((dataRelation) => {
      const geoData1: GeometricalDataCTO | null = getGeometriaclDataByDataId(dataRelation.data1Fk);
      const geoData2: GeometricalDataCTO | null = getGeometriaclDataByDataId(dataRelation.data2Fk);
      if (!(dataRelationToEdit && dataRelationToEdit.id === dataRelation.id) && geoData1 && geoData2) {
        return createCornerConnection(geoData1, geoData2, dataRelation, dataRelation.id);
      } else {
        return <></>;
      }
    });
  };

  const createDnDMetaDataFragmentIfNotinEdit = (dataCTO: DataCTO) => {
    if (!(dataCTOToEdit && dataCTOToEdit.data.id === dataCTO.data.id)) {
      return createDnDMetaDataFragment(dataCTO);
    }
  };

  const createDnDMetaDataFragment = (dataCTO: DataCTO) => {
    let metaDataFragment = createMetaDataFragment(
      dataCTO,
      componentDatas.filter((comp) => comp.parentId === dataCTO.data.id),
      onClick
    );
    return createDnDItem(dataCTO.geometricalData, onPositionUpdate, constraintsRef, metaDataFragment);
  };

  const createDataRelationToEdit = (dataRelation: DataRelationTO) => {
    const geoData1: GeometricalDataCTO | null = getGeometriaclDataByDataId(dataRelation.data1Fk);
    const geoData2: GeometricalDataCTO | null = getGeometriaclDataByDataId(dataRelation.data2Fk);
    if (
      dataRelation.data1Fk !== -1 &&
      dataRelation.data2Fk !== -1 &&
      dataRelation.direction1 &&
      dataRelation.direction2 &&
      geoData1 &&
      geoData2
    ) {
      return createCornerConnection(geoData1, geoData2, dataRelation, dataRelation.id, true);
    }
  };

  const getGeometriaclDataByDataId = (dataId: number): GeometricalDataCTO | null => {
    const data: DataCTO | undefined = dataCTOs.find((data) => data.data.id === dataId);
    if (data) {
      return data.geometricalData;
    }
    return null;
  };

  return (
    <motion.div id="datadndBox" ref={constraintsRef} className="dataModel">
      {dataCTOs.map(createDnDMetaDataFragmentIfNotinEdit)}
      {dataCTOToEdit && createDnDMetaDataFragment(dataCTOToEdit)}
      <motion.svg className="dataSVGArea">
        {createConnections()}
        {dataRelationToEdit && createDataRelationToEdit(dataRelationToEdit)}
      </motion.svg>
    </motion.div>
  );
};
