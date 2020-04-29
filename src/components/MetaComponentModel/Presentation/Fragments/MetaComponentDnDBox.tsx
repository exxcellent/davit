import { Box } from "@chakra-ui/core";
import { motion } from "framer-motion";
import React, { FunctionComponent, useRef } from "react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { createArrow } from "../../../common/fragments/Arrow";
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
    for (let i = 0; componentCTOs.length; i++) {
      if (componentCTOs[i].geometricalData.position.id === id) {
        let copyComponentCTO: ComponentCTO = JSON.parse(
          JSON.stringify(componentCTOs[i])
        );
        copyComponentCTO.geometricalData.position.x = x;
        copyComponentCTO.geometricalData.position.y = y;
        onSaveCallBack(copyComponentCTO);
        break;
      }
    }
  };

  const createDnDMetaComponent = (componentCTO: ComponentCTO) => {
    let metaComponentFragment = createMetaComponentFragment(
      componentCTO,
      onDeleteCallBack,
      step
    );
    console.log(step);
    return createDnDItem(
      componentCTO.geometricalData.position,
      componentCTO.geometricalData.position.id,
      onPositionUpdate,
      constraintsRef,
      metaComponentFragment
    );
  };

  return (
    <Box w="100%" h="100em" bg="#e8ede6" borderWidth="1px">
      <motion.div
        ref={constraintsRef}
        style={{ height: "100vh", width: "100%", position: "relative" }}
      >
        {componentCTOs.map(createDnDMetaComponent)}
        {step &&
          createArrow(
            step.componentCTOSource.geometricalData,
            step.componentCTOTarget.geometricalData
          )}
      </motion.div>
    </Box>
  );
};
