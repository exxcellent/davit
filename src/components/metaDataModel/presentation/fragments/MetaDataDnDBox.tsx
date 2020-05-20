import { motion } from "framer-motion";
import React, { FunctionComponent, useRef } from "react";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { createCornerConnection } from "../../../common/fragments/svg/Carv2Path";
import { createMetaDataFragment } from "./MetaDataFragment";

interface MetaDataDnDBox {
  dataCTOs: DataCTO[];
  dataCTOToEdit: DataCTO | null;
  dataRelations: DataRelationCTO[];
  step?: SequenceStepCTO;
  onSaveCallBack: (dataCTO: DataCTO) => void;
  onDeleteCallBack: (id: number) => void;
}

export const MetaDataDnDBox: FunctionComponent<MetaDataDnDBox> = (props) => {
  const {
    dataCTOs,
    dataCTOToEdit,
    onSaveCallBack,
    onDeleteCallBack,
    step,
    dataRelations,
  } = props;

  const constraintsRef = useRef(null);

  const onPositionUpdate = (x: number, y: number, positionId: number) => {
    const dataCTO = dataCTOs.find(
      (dataCTO) => dataCTO.geometricalData.position.id === positionId
    );
    if (dataCTO) {
      let copyDataCTO: DataCTO = JSON.parse(JSON.stringify(dataCTO));
      copyDataCTO.geometricalData.position.x = x;
      copyDataCTO.geometricalData.position.y = y;
      onSaveCallBack(copyDataCTO);
    }
  };

  const createConnections = () => {
    return dataRelations.map((dataRelation) => {
      return createCornerConnection(
        dataRelation.dataCTO1.geometricalData,
        dataRelation.dataCTO2.geometricalData,
        dataRelation.dataRelationTO,
        dataRelation.dataRelationTO.id
      );
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
      onDeleteCallBack,
      step
    );
    return createDnDItem(
      dataCTO.geometricalData,
      onPositionUpdate,
      constraintsRef,
      metaDataFragment
    );
  };

  return (
    <motion.div id="datadndBox" ref={constraintsRef} className="dataModel">
      {
        dataCTOs.map(createDnDMetaDataFragmentIfNotinEdit)
        // .filter((dndBox) => !isNullOrUndefined(dndBox))
      }
      {dataCTOToEdit && createDnDMetaDataFragment(dataCTOToEdit)}
      {createConnections()}
    </motion.div>
  );
};
