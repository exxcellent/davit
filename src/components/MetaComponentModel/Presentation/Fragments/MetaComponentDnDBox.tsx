import React, { FunctionComponent, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { MetaComponentFragment } from "./MetaComponentFragment";
import { DnDWrapper } from "../../../common/styles/DnDWrapper";
import PositionTO from "../../../../dataAccess/PositionTO";
import { ComponentCTO } from "../../../../dataAccess/ComponentCTO";
import { isNullOrUndefined } from "util";

interface MetaComponentDnDBox {
  componentCTOs: ComponentCTO[];
}

export const MetaComponentDnDBox: FunctionComponent<MetaComponentDnDBox> = (
  props
) => {
  const { componentCTOs } = props;
  const constraintsRef = useRef(null);

  const createDnDItem = (
    positionTO: PositionTO,
    index: number,
    children: React.ReactNode
  ) => {
    // TODO: to be removed for testing...
    let posX = 0;
    let posY = 0;
    if (!isNullOrUndefined(positionTO.x)) {
      posX = positionTO.x;
    }
    if (!isNullOrUndefined(positionTO.y)) {
      posY = positionTO.y;
    }
    return (
      <DnDWrapper
        key={index}
        initalX={posX}
        initalY={posY}
        constraintsRef={constraintsRef}
      >
        {children}
      </DnDWrapper>
    );
  };

  return (
    <DnDBox ref={constraintsRef}>
      {componentCTOs.map((componentCTO, index: number) => {
        return createDnDItem(
          componentCTO.position,
          index,
          <MetaComponentFragment
            name={componentCTO.component.name}
            x={componentCTO.position.x}
            y={componentCTO.position.y}
            id={componentCTO.component.id}
          />
        );
      })}
    </DnDBox>
  );
};

// ---------- Styling ----------

const DnDBox = styled(motion.div)`
  background: white;
  width: 100%;
  height: 500px;
  position: relative;
`;
