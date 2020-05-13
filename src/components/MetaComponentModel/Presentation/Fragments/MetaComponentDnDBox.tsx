import { motion } from "framer-motion";
import React, { FunctionComponent, useRef } from "react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { createCurveArrow } from "../../../common/fragments/Arrow";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { createMetaComponentFragment } from "./MetaComponentFragment";

interface MetaComponentDnDBox {
  componentCTOs: ComponentCTO[];
  step?: SequenceStepCTO;
  onSaveCallBack: (componentCTO: ComponentCTO) => void;
  onDeleteCallBack: (id: number) => void;
}

export const MetaComponentDnDBox: FunctionComponent<MetaComponentDnDBox> = (
  props
) => {
  const { componentCTOs, onSaveCallBack, onDeleteCallBack, step } = props;

  const constraintsRef = useRef(null);

  const onPositionUpdate = (x: number, y: number, id: number) => {
    console.info("onPositionUpdate() x: " + x + " y: " + y + ".");
    const componentCTO = componentCTOs.find(
      (componentCTO) => componentCTO.geometricalData.position.id === id
    );
    if (componentCTO) {
      let copyComponentCTO: ComponentCTO = JSON.parse(
        JSON.stringify(componentCTO)
      );
      copyComponentCTO.geometricalData.position.x = x;
      copyComponentCTO.geometricalData.position.y = y;
      onSaveCallBack(copyComponentCTO);
    }
  };

  const createDnDMetaComponent = (componentCTO: ComponentCTO) => {
    let metaComponentFragment = createMetaComponentFragment(
      componentCTO,
      onDeleteCallBack,
      step
    );
    return createDnDItem(
      componentCTO.geometricalData,
      onPositionUpdate,
      constraintsRef,
      metaComponentFragment
    );
  };

  return (
    <motion.div id="dndBox" ref={constraintsRef} className="componentModel">
      {componentCTOs.map(createDnDMetaComponent)}
      {step &&
        createCurveArrow(
          componentCTOs.find(
            (componentCTO) =>
              componentCTO.component.id === step.squenceStepTO.sourceComponentFk
          )?.geometricalData,
          componentCTOs.find(
            (componentCTO) =>
              componentCTO.component.id === step.squenceStepTO.targetComponentFk
          )?.geometricalData
        )}
    </motion.div>
  );
};
