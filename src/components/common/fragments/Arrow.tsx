import { motion } from "framer-motion";
import React, { FunctionComponent } from "react";
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
    <motion.svg
      style={{
        overflow: "visible",
        stroke: "black",
        strokeWidth: "2",
        position: "absolute",
        width: 0,
        height: 0,
      }}
    >
      <defs>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          // markerUnits="strokeWidth"
          strokeWidth="0"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="black" />
        </marker>
      </defs>
      <line
        x1={xSource + 150}
        y1={ySource + 60}
        x2={xTarget - 2}
        y2={yTarget + 60}
        stroke="black"
        markerEnd="url(#arrow)"
      />
    </motion.svg>
  );
};

export const createArrow = (
  source: GeometricalDataCTO | undefined,
  target: GeometricalDataCTO | undefined
) => {
  if (source && target) {
    return (
      <Arrow
        xSource={source.position.x}
        ySource={source.position.y}
        xTarget={target.position.x}
        yTarget={target.position.y}
      />
    );
  }
};
