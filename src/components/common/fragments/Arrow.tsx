import { motion } from "framer-motion";
import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { GeometricalDataCTO } from "../../../dataAccess/access/cto/GeometraicalDataCTO";

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

export const createArrow = (
  source: GeometricalDataCTO,
  target: GeometricalDataCTO
) => {
  return (
    <Arrow
      xSource={source.position.x}
      ySource={source.position.y}
      xTarget={target.position.x}
      yTarget={target.position.y}
    />
  );
};

const SVG = styled(motion.svg)`
  position: absolute;
  color: black;
  border-width: 2px;
  width: 100%;
  height: 500em;
`;
