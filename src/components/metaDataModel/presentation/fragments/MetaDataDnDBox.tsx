import { motion } from "framer-motion";
import React, { FunctionComponent, useRef } from "react";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { Carv2Util } from "../../../../utils/Carv2Util";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { createCornerConnection } from "../../../common/fragments/svg/Carv2Path";
import { createMetaDataFragment } from "./MetaDataFragment";

interface MetaDataDnDBox {
  dataCTOs: DataCTO[];
  dataCTOToEdit: DataCTO | null;
  dataRelationToEdit: DataRelationCTO | null;
  dataRelations: DataRelationCTO[];
  step: SequenceStepCTO | null;
  onSaveCallBack: (dataCTO: DataCTO) => void;
}

export const MetaDataDnDBox: FunctionComponent<MetaDataDnDBox> = (props) => {
  const { dataCTOs, dataCTOToEdit, onSaveCallBack, step, dataRelations, dataRelationToEdit } = props;

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
      if (!(dataRelationToEdit && dataRelationToEdit.dataRelationTO.id === dataRelation.dataRelationTO.id)) {
        return createCornerConnection(
          dataRelation.dataCTO1.geometricalData,
          dataRelation.dataCTO2.geometricalData,
          dataRelation.dataRelationTO,
          dataRelation.dataRelationTO.id
        );
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
    let metaDataFragment = createMetaDataFragment(dataCTO, step);
    return createDnDItem(dataCTO.geometricalData, onPositionUpdate, constraintsRef, metaDataFragment);
  };

  const createDataRelationToEdit = (dataRelation: DataRelationCTO) => {
    if (
      dataRelation.dataCTO1.data.id !== -1 &&
      dataRelation.dataCTO2.data.id !== -1 &&
      dataRelation.dataRelationTO.direction1 &&
      dataRelation.dataRelationTO.direction2
    ) {
      return createCornerConnection(
        dataRelation.dataCTO1.geometricalData,
        dataRelation.dataCTO2.geometricalData,
        dataRelation.dataRelationTO,
        dataRelation.dataRelationTO.id,
        true
      );
    }
  };

  return (
    <motion.div id="datadndBox" ref={constraintsRef} className="dataModel">
      {dataCTOs.map(createDnDMetaDataFragmentIfNotinEdit)}
      {dataCTOToEdit && createDnDMetaDataFragment(dataCTOToEdit)}
      {createConnections()}
      {dataRelationToEdit && createDataRelationToEdit(dataRelationToEdit)}
    </motion.div>
  );
};
