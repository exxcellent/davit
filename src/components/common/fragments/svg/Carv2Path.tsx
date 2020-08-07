import { Point } from "framer-motion";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { GeometricalDataCTO } from "../../../../dataAccess/access/cto/GeometraicalDataCTO";
import { DataRelationTO, Direction, RelationType } from "../../../../dataAccess/access/to/DataRelationTO";

export interface Carv2PathProps {
  xSource: number;
  ySource: number;
  xTarget: number;
  yTarget: number;
  direction1: Direction;
  direction2: Direction;
  label1: string;
  label2: string;
  type1: RelationType;
  type2: RelationType;
  id: number;
  parentRef: any;
  stroked?: boolean;
}

const Carv2Path: FunctionComponent<Carv2PathProps> = (props) => {
  const { xSource, ySource, xTarget, yTarget, direction1, direction2, id, stroked, parentRef } = props;

  const [initXSource, setInitXSource] = useState<number>(xSource);
  const [initYSource, setInitYSource] = useState<number>(ySource);
  const [initXTarget, setInitXTarget] = useState<number>(xTarget);
  const [initYTarget, setInitYTarget] = useState<number>(yTarget);

  useEffect(() => {
    if (parentRef !== undefined && parentRef.current !== undefined) {
      setInitXSource(xSource * (parentRef.current.offsetWidth / 100));
      setInitYSource(ySource * (parentRef.current.offsetHeight / 100));
      setInitXTarget(xTarget * (parentRef.current.offsetWidth / 100));
      setInitYTarget(yTarget * (parentRef.current.offsetHeight / 100));
    }
  }, [ySource, xSource, yTarget, xTarget, parentRef]);

  const TOP: Point = { x: 80, y: 0 };
  const BOTTOM: Point = { x: 80, y: 50 };
  const LEFT: Point = { x: 0, y: 25 };
  const RIGHT: Point = { x: 150, y: 25 };

  const createCornerLine = () => {
    let startPoint: Point = { x: initXSource, y: initYSource };
    let endPoint: Point = { x: initXTarget, y: initYTarget };
    // set interfaces
    const directionPoint1 = getDirectionPoint(direction1);
    const directionPoint2 = getDirectionPoint(direction2);
    startPoint = plusPoint(startPoint, directionPoint1);
    endPoint = plusPoint(endPoint, directionPoint2);

    const offset1 = getDirectionOffset(direction1);
    const offset2 = getDirectionOffset(direction2);

    const offsetPoint1 = plusPoint(startPoint, offset1);
    const offsetPoint2 = plusPoint(endPoint, offset2);

    const className = stroked ? "carvPath carvStrokeDasharray" : "carvPath";

    return (
      <path
        d={`M ${startPoint.x},${startPoint.y} 
        L ${offsetPoint1.x},${offsetPoint1.y}
        L ${offsetPoint2.x},${offsetPoint2.y}
        L ${endPoint.x},${endPoint.y}
        `}
        className={className}
        id={id.toString()}
        ref={pathRef}
      />
    );
  };

  const getDirectionPoint = (direction: Direction): Point => {
    switch (direction) {
      case Direction.TOP:
        return TOP;
      case Direction.LEFT:
        return LEFT;
      case Direction.RIGHT:
        return RIGHT;
      case Direction.BOTTOM:
        return BOTTOM;
    }
  };

  const getDirectionOffset = (direction: Direction): Point => {
    const offset = 25;
    switch (direction) {
      case Direction.TOP:
        return { x: 0, y: -offset };
      case Direction.LEFT:
        return { x: -offset, y: 0 };
      case Direction.RIGHT:
        return { x: offset, y: 0 };
      case Direction.BOTTOM:
        return { x: 0, y: offset };
    }
  };

  const plusPoint = (point1: Point, point2: Point): Point => {
    return { x: point1.x + point2.x, y: point1.y + point2.y };
  };

  const pathRef = useRef<SVGPathElement>(null);

  return createCornerLine();
};

export const createCornerConnection = (
  source: GeometricalDataCTO | undefined,
  target: GeometricalDataCTO | undefined,
  dataRelation: DataRelationTO,
  key: number,
  parentRef: any,
  stroked?: boolean
) => {
  if (source && target) {
    return (
      <Carv2Path
        xSource={source.position.x}
        ySource={source.position.y}
        xTarget={target.position.x}
        yTarget={target.position.y}
        key={key}
        direction1={dataRelation.direction1}
        direction2={dataRelation.direction2}
        label1={dataRelation.label1}
        label2={dataRelation.label2}
        type1={dataRelation.type1}
        type2={dataRelation.type2}
        id={dataRelation.id}
        stroked={stroked}
        parentRef={parentRef}
      />
    );
  }
};