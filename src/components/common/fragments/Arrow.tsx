import { motion, Point } from "framer-motion";
import React, { FunctionComponent } from "react";
import { GeometricalDataCTO } from "../../../dataAccess/access/cto/GeometraicalDataCTO";

export interface ArrowProps {
  xSource: number;
  ySource: number;
  xTarget: number;
  yTarget: number;
  type: ArrowType;
}

enum ArrowType {
  CURVE = "Curve",
  CORNER = "CORNER",
}

const Arrow: FunctionComponent<ArrowProps> = (props) => {
  const { xSource, ySource, xTarget, yTarget, type } = props;

  const INTERFACE_INPUT: Point = { x: 0, y: 60 };
  const INTERFACE_OUTPUT: Point = { x: 150, y: 60 };
  const OFFSET: number = 10;

  const createCurve = (x1: number, y1: number, x2: number, y2: number) => {
    let startPoint: Point = { x: x1, y: y1 };
    let endPoint: Point = { x: x2, y: y2 };
    // set interfaces
    startPoint = plusPoint(startPoint, INTERFACE_OUTPUT);
    endPoint = plusPoint(endPoint, INTERFACE_INPUT);
    // add object offset
    const offsetStartPoint = setOutPutOffset(startPoint, OFFSET);
    endPoint = setInputPutOffset(endPoint, OFFSET);

    const middlePoint = getMiddlePoint(offsetStartPoint, endPoint);
    const curveRefPoint = getCurvRefPoint(offsetStartPoint, middlePoint);

    return (
      <path
        d={`M ${startPoint.x},${startPoint.y} 
        l 10,0
        Q ${curveRefPoint.x}, 
        ${curveRefPoint.y} 
        ${middlePoint.x}, 
        ${middlePoint.y}
        T ${endPoint.x}, ${endPoint.y}
        l 10,0
        `}
        className="carvPath"
        markerEnd="url(#arrow)"
      />
    );
  };

  const createCornerLine = (x1: number, y1: number, x2: number, y2: number) => {
    let startPoint: Point = { x: x1, y: y1 };
    let endPoint: Point = { x: x2, y: y2 };
    // set interfaces
    startPoint = plusPoint(startPoint, INTERFACE_OUTPUT);
    endPoint = plusPoint(endPoint, INTERFACE_INPUT);

    const middlePoint = getMiddlePoint(startPoint, endPoint);

    return (
      <path
        d={`M ${startPoint.x},${startPoint.y} 
        l ${middlePoint.x - startPoint.x},0
        l 0,${endPoint.y - startPoint.y}
        l ${endPoint.x - middlePoint.x},0
        `}
        markerEnd="url(#arrow)"
        className="carvPath"
      />
    );
  };

  const getMiddleValue = (val1: number, val2: number): number => {
    let middleValue = (val2 - val1) / 2 + val1;
    return middleValue;
  };

  const setOutPutOffset = (point: Point, offset: number): Point => {
    return { x: point.x + offset, y: point.y };
  };

  const setInputPutOffset = (point: Point, offset: number): Point => {
    return { x: point.x - offset, y: point.y };
  };

  const plusPoint = (point1: Point, point2: Point): Point => {
    return { x: point1.x + point2.x, y: point1.y + point2.y };
  };

  const getMiddlePoint = (startPoint: Point, endPoint: Point): Point => {
    return {
      x: getMiddleValue(startPoint.x, endPoint.x),
      y: getMiddleValue(startPoint.y, endPoint.y),
    };
  };

  const getCurvRefPoint = (
    curveStartPoint: Point,
    curveEndPoint: Point
  ): Point => {
    return {
      x: getMiddleValue(curveStartPoint.x, curveEndPoint.x),
      y: curveStartPoint.y,
    };
  };

  return (
    <motion.svg
      style={{
        overflow: "visible",
        stroke: "black",
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
          strokeWidth="0"
        >
          <path d="M0,0 L0,6 L9,3 z" className="carvArrowMarker" />
        </marker>
      </defs>
      {type === ArrowType.CURVE &&
        createCurve(xSource, ySource, xTarget, yTarget)}
      {type === ArrowType.CORNER &&
        createCornerLine(xSource, ySource, xTarget, yTarget)}
    </motion.svg>
  );
};

export const createCurveArrow = (
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
        type={ArrowType.CURVE}
      />
    );
  }
};

export const createCornerArrow = (
  source: GeometricalDataCTO | undefined,
  target: GeometricalDataCTO | undefined,
  key: number
) => {
  if (source && target) {
    return (
      <Arrow
        xSource={source.position.x}
        ySource={source.position.y}
        xTarget={target.position.x}
        yTarget={target.position.y}
        type={ArrowType.CORNER}
        key={key}
      />
    );
  }
};
