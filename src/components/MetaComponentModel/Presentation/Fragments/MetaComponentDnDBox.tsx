import { motion } from "framer-motion";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { ASPECT_RATIO, WINDOW_FACTOR } from "../../../../app/Carv2Constanc";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { GroupTO } from "../../../../dataAccess/access/to/GroupTO";
import { Carv2Util } from "../../../../utils/Carv2Util";
import { useCurrentHeight, useCurrentWitdh } from "../../../../utils/WindowUtil";
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

  const { height, width, constraintsRef, key } = useMetaComponentDnDBoxViewModel();

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
      style={fullScreen ? { height: height, maxWidth: width } : {}}
      className={fullScreen ? "componentModelFullscreen" : "componentModel"}
      key={key}
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

const useMetaComponentDnDBoxViewModel = () => {
  const [key, setKey] = useState<number>(0);
  const constraintsRef = useRef<HTMLInputElement>(null);

  const currentWindowWitdh: number = useCurrentWitdh();
  const currentWindowHeight: number = useCurrentHeight();
  const newWindowHeight: number = (currentWindowWitdh / WINDOW_FACTOR) * ASPECT_RATIO;
  const newWindowWitdh: number = (currentWindowHeight / ASPECT_RATIO) * WINDOW_FACTOR;

  useEffect(() => {
    const handleResize = () => setKey((prevState) => prevState + 1);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    constraintsRef,
    height: newWindowHeight,
    width: newWindowWitdh,
    key,
  };
};
