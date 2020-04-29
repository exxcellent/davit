import { motion } from "framer-motion";
import React, { FunctionComponent } from "react";
import { PositionTO } from "../../../dataAccess/access/to/PositionTO";

export interface DnDWrapperProps {
  constraintsRef: any;
  positionId: number;
  initalX: number;
  initalY: number;
  onPositionUpdate: (x: number, y: number, positionId: number) => void;
}

export const DnDWrapper: FunctionComponent<DnDWrapperProps> = (props) => {
  const {
    constraintsRef,
    initalX,
    initalY,
    onPositionUpdate,
    positionId,
  } = props;

  console.info("DnDItem rendering!");

  return (
    <motion.div
      drag={true}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: initalX, y: initalY }}
      onDragEnd={(event, info) => {
        onPositionUpdate(
          // keine Nachkommastellen.
          Number(info.point.x.toFixed(0)),
          Number(info.point.y.toFixed(0)),
          positionId
        );
        console.log("New 'X' position: " + info.point.x);
        console.log("New 'Y' position: " + info.point.y);
      }}
      style={{ width: "0%" }}
    >
      {props.children}
    </motion.div>
  );
};

export const createDnDItem = (
  positionTO: PositionTO,
  key: number,
  onPositionUpdateCallBack: (x: number, y: number, positionId: number) => void,
  constraintsRef: any,
  children: React.ReactNode
) => {
  return (
    <DnDWrapper
      key={key}
      onPositionUpdate={onPositionUpdateCallBack}
      positionId={positionTO.id}
      initalX={positionTO.x}
      initalY={positionTO.y}
      constraintsRef={constraintsRef}
    >
      {children}
    </DnDWrapper>
  );
};
