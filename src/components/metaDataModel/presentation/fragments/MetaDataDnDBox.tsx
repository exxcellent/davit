import { motion } from "framer-motion";
import React, { FunctionComponent, useRef } from "react";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { createMetaDataFragment } from "./MetaDataFragment";

interface MetaDataDnDBox {
  dataCTOs: DataCTO[];
  step?: SequenceStepCTO;
  onSaveCallBack: (dataCTO: DataCTO) => void;
  onDeleteCallBack: (id: number) => void;
}

export const MetaDataDnDBox: FunctionComponent<MetaDataDnDBox> = (props) => {
  const { dataCTOs, onSaveCallBack, onDeleteCallBack, step } = props;

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
      {dataCTOs.map(createDnDMetaDataFragment)}
      {/* {step &&
        createArrow(
          dataCTOs.find(
            (dataCTO) =>
              dataCTO.data.id === step.squenceStepTO.sourceComponentFk
          )?.geometricalData,
          componentCTOs.find(
            (componentCTO) =>
              componentCTO.component.id === step.squenceStepTO.targetComponentFk
          )?.geometricalData
        )} */}
    </motion.div>
  );
};
