import { motion } from "framer-motion";
import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";

export interface ArrowProps {
  xSource: number;
  ySource: number;
  xTarget: number;
  yTarget: number;
}

export const Arrow: FunctionComponent<ArrowProps> = (props) => {
  const { xSource, ySource, xTarget, yTarget } = props;

  return (
    <SVG>
      <line
        x1={xSource}
        y1={ySource}
        x2={xTarget}
        y2={yTarget}
        stroke="black"
      />
    </SVG>
  );
};

export const createArrow = (step: SequenceStepCTO, key: number) => {
  return (
    <Arrow
      xSource={step.componentCTOSource.geometricalData.position.x}
      ySource={step.componentCTOSource.geometricalData.position.y}
      xTarget={step.componentCTOTarget.geometricalData.position.x}
      yTarget={step.componentCTOTarget.geometricalData.position.y}
    />
  );
};

const SVG = styled(motion.svg)`
  color: black;
  border-width: 2px;
  width: 100%;
  height: 500em;
`;
