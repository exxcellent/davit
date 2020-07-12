import { motion } from "framer-motion";
import React, { FunctionComponent, useEffect, useState } from "react";
import { GeometricalDataCTO } from "../../../dataAccess/access/cto/GeometraicalDataCTO";

export interface DnDWrapperProps {
  dragConstraintsRef: any;
  positionId: number;
  initalX: number;
  initalY: number;
  onPositionUpdate: (x: number, y: number, positionId: number) => void;
  shadow?: string;
}

export const DnDWrapper: FunctionComponent<DnDWrapperProps> = (props) => {
  const { dragConstraintsRef, initalX, initalY, onPositionUpdate, positionId, shadow } = props;
  const [shadowColor, setShadowColor] = useState<string>("");

  useEffect(() => {
    if (shadow) {
      setShadowColor("3px 3px 3px " + shadow);
    } else {
      setShadowColor("");
    }
  }, [shadow]);

  return (
    <motion.div
      drag={true}
      dragConstraints={dragConstraintsRef}
      dragMomentum={false}
      dragElastic={0}
      initial={{
        x: initalX,
        y: initalY,
      }}
      onDragEnd={(event, info) => {
        onPositionUpdate(
          // keine Nachkommastellen.
          Number(info.point.x.toFixed(0)),
          Number(info.point.y.toFixed(0)),
          positionId
        );
      }}
      style={{ position: "absolute", display: "inline-flex", zIndex: 1, boxShadow: shadowColor }}
    >
      {props.children}
    </motion.div>
  );
};

export const createDnDItem = (
  geometricalDataCTO: GeometricalDataCTO,
  onPositionUpdateCallBack: (x: number, y: number, positionId: number) => void,
  dragConstraintsRef: any,
  children: React.ReactNode,
  shadow?: string
) => {
  return (
    <DnDWrapper
      key={geometricalDataCTO.position.id}
      onPositionUpdate={onPositionUpdateCallBack}
      positionId={geometricalDataCTO.position.id}
      initalX={geometricalDataCTO.position.x}
      initalY={geometricalDataCTO.position.y}
      dragConstraintsRef={dragConstraintsRef}
      shadow={shadow}
    >
      {children}
    </DnDWrapper>
  );
};
