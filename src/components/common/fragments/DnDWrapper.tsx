import { motion } from "framer-motion";
import React, { FunctionComponent } from "react";
import { GeometricalDataCTO } from "../../../dataAccess/access/cto/GeometraicalDataCTO";

export interface DnDWrapperProps {
  dragConstraintsRef: any;
  positionId: number;
  initalX: number;
  initalY: number;
  onPositionUpdate: (x: number, y: number, positionId: number) => void;
}

export const DnDWrapper: FunctionComponent<DnDWrapperProps> = (props) => {
  const { dragConstraintsRef, initalX, initalY, onPositionUpdate, positionId } = props;

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
        console.log("X: " + info.point.x);
        console.log("Y: " + info.point.y);
      }}
      style={{ position: "absolute", display: "inline-flex", zIndex: 1 }}
    >
      {props.children}
    </motion.div>
  );
};

export const createDnDItem = (
  geometricalDataCTO: GeometricalDataCTO,
  onPositionUpdateCallBack: (x: number, y: number, positionId: number) => void,
  dragConstraintsRef: any,
  children: React.ReactNode
) => {
  return (
    <DnDWrapper
      key={geometricalDataCTO.position.id}
      onPositionUpdate={onPositionUpdateCallBack}
      positionId={geometricalDataCTO.position.id}
      initalX={geometricalDataCTO.position.x}
      initalY={geometricalDataCTO.position.y}
      dragConstraintsRef={dragConstraintsRef}
    >
      {children}
    </DnDWrapper>
  );
};
