import { motion } from "framer-motion";
import React, { FunctionComponent, useRef } from "react";
import { useCurrentHeight, useCurrentWitdh } from "../../../../app/Carv2";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { GroupTO } from "../../../../dataAccess/access/to/GroupTO";
import { Carv2Util } from "../../../../utils/Carv2Util";
import { ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { createCurveArrow } from "../../../common/fragments/svg/Arrow";
import { Arrows } from "../MetaComponentModelController";
import { createMetaComponentFragment } from "./MetaComponentFragment";

interface MetaComponentDnDBox {
  componentCTOs: ComponentCTO[];
  groups: GroupTO[];
  componentCTOToEdit: ComponentCTO | null;
  arrows: Arrows[];
  componentDatas: ViewFragmentProps[];
  onSaveCallBack: (componentCTO: ComponentCTO) => void;
  onClick: (componentId: number) => void;
  fullScreen?: boolean;
}

export const MetaComponentDnDBox: FunctionComponent<MetaComponentDnDBox> = (props) => {
  const {
    componentCTOs,
    onSaveCallBack,
    arrows,
    componentCTOToEdit,
    groups,
    componentDatas,
    onClick,
    fullScreen,
  } = props;
  const constraintsRef = useRef<HTMLInputElement>(null);

  // full size window
  const w1: number = useCurrentWitdh();
  const h1: number = useCurrentHeight();
  const h2: number = (w1 / 100) * 56.25;
  const w2: number = (h1 / 56.25) * 100;

  const onPositionUpdate = (x: number, y: number, positionId: number) => {
    const componentCTO = componentCTOs.find((componentCTO) => componentCTO.geometricalData.position.id === positionId);
    if (componentCTO) {
      let copyComponentCTO: ComponentCTO = Carv2Util.deepCopy(componentCTO);
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
    let metaComponentFragment = createMetaComponentFragment(
      componentCTO,
      componentDatas.filter((compdata) => compdata.parentId === componentCTO.component.id),
      onClick
    );
    let shadow: string = "";
    if (componentCTO.component.groupFks !== -1) {
      shadow = groups.find((group) => group.id === componentCTO.component.groupFks)?.color || "";
    }
    return createDnDItem(componentCTO.geometricalData, onPositionUpdate, constraintsRef, metaComponentFragment, shadow);
  };

  const findComponentById = (id: number): ComponentCTO | undefined => {
    return componentCTOs.find((comp) => comp.component.id === id);
  };

  return (
    <motion.div
      id="dndBox"
      ref={constraintsRef}
      style={
        fullScreen
          ? {
              height: h2,
              maxWidth: w2,
              borderWidth: "3px",
              borderStyle: "dashed",
              backgroundColor: "var(--carv2-background-color)",
            }
          : {}
      }
      className={fullScreen ? "" : "componentModel"}
    >
      {componentCTOs.map(createDnDMetaComponentFragmentIfNotInEdit)}
      {componentCTOToEdit && createDnDMetaComponent(componentCTOToEdit)}
      {arrows.map((arrow) => {
        return createCurveArrow(
          findComponentById(arrow.sourceComponentId)?.geometricalData,
          findComponentById(arrow.targetComponentId)?.geometricalData,
          constraintsRef
        );
      })}
    </motion.div>
  );
};
