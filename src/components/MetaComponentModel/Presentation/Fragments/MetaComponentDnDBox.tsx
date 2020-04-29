import { Box } from "@chakra-ui/core";
import { motion } from "framer-motion";
import React, { FunctionComponent, useRef } from "react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { ComponentDataCTO } from "../../../../dataAccess/access/cto/ComponentDataCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { ComponentDataState } from "../../../../dataAccess/access/types/ComponentDataState";
import { createArrow } from "../../../common/fragments/Arrow";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { DataFragmentProps } from "./DataFragment";
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

  const componentDataToDataFragmentProp = (
    componentData: ComponentDataCTO
  ): DataFragmentProps => {
    return {
      name: componentData.dataTO.name,
      color: getColorForComponentDataState(
        componentData.componentDataTO.componentDataState
      ),
    };
  };

  const getColorForComponentDataState = (state: ComponentDataState) => {
    switch (state) {
      case ComponentDataState.NEW:
        return "green";
      case ComponentDataState.PERSISTENT:
        return "blue";
      case ComponentDataState.DELETED:
        return "red";
      default:
        return "black";
    }
  };

  const createDnDMetaComponent = (componentCTO: ComponentCTO) => {
    return createDnDItem(
      componentCTO.geometricalData.position,
      componentCTO.component.id,
      onPositionUpdate,
      constraintsRef,
      createMetaComponentFragment(
        componentCTO,
        step ? step.componentDataCTOs.map(componentDataToDataFragmentProp) : [],
        onDeleteCallBack
      )
    );
  };

  return (
    <Box w="100%" h="100em" bg="#e8ede6" borderWidth="1px">
      <motion.div ref={constraintsRef} style={{ height: "100vh" }}>
        {componentCTOs.map(createDnDMetaComponent)}
        {step && createArrow(step, step.step.id)}
      </motion.div>
    </Box>
  );
};
