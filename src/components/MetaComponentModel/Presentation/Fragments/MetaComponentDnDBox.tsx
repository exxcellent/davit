import { motion } from "framer-motion";
import React, { FunctionComponent, useRef } from "react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { createCurveArrow } from "../../../common/fragments/svg/Arrow";
import { createMetaComponentFragment } from "./MetaComponentFragment";

interface MetaComponentDnDBox {
  componentCTOs: ComponentCTO[];
  componentCTOToEdit: ComponentCTO | null;
  step: SequenceStepCTO | null;
  onSaveCallBack: (componentCTO: ComponentCTO) => void;
}

export const MetaComponentDnDBox: FunctionComponent<MetaComponentDnDBox> = (props) => {
  const { componentCTOs, onSaveCallBack, step, componentCTOToEdit } = props;

  const constraintsRef = useRef(null);

  const onPositionUpdate = (x: number, y: number, positionId: number) => {
    console.info("onPositionUpdate() x: " + x + " y: " + y + ".");
    const componentCTO = componentCTOs.find((componentCTO) => componentCTO.geometricalData.position.id === positionId);
    if (componentCTO) {
      let copyComponentCTO: ComponentCTO = JSON.parse(JSON.stringify(componentCTO));
      copyComponentCTO.geometricalData.position.x = x;
      copyComponentCTO.geometricalData.position.y = y;
      onSaveCallBack(copyComponentCTO);
    }
  };

  const createDnDMetaComponentFragmentIfNotInEdit = (componentCTO: ComponentCTO) => {
    if (!(componentCTOToEdit && componentCTOToEdit.component.id === componentCTO.component.id)) {
      return createDnDMetaComponent(componentCTO);
    }
  };

  const createDnDMetaComponent = (componentCTO: ComponentCTO) => {
    let metaComponentFragment = createMetaComponentFragment(componentCTO, step);
    return createDnDItem(componentCTO.geometricalData, onPositionUpdate, constraintsRef, metaComponentFragment);
  };

  return (
    <motion.div id="dndBox" ref={constraintsRef} className="componentModel">
      {componentCTOs.map(createDnDMetaComponentFragmentIfNotInEdit)}
      {componentCTOToEdit && createDnDMetaComponent(componentCTOToEdit)}
      {step &&
        createCurveArrow(
          componentCTOs.find((componentCTO) => componentCTO.component.id === step.componentCTOSource.component.id)
            ?.geometricalData,
          componentCTOs.find((componentCTO) => componentCTO.component.id === step.componentCTOTarget.component.id)
            ?.geometricalData
        )}
    </motion.div>
  );
};
