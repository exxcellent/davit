import { motion, useInvertedScale, useMotionValue } from "framer-motion";
import React, { FunctionComponent, useEffect } from "react";
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

  const x = useMotionValue(initalX);
  const y = useMotionValue(initalY);
  const { scaleX, scaleY } = useInvertedScale();

  useEffect(() => {
    x.set(initalX * (dragConstraintsRef.current.offsetWidth / 100));
    y.set(initalY * (dragConstraintsRef.current.offsetHeight / 100));
  }, [x, initalX, y, initalY, dragConstraintsRef]);

  return (
    <motion.div
      drag={true}
      dragConstraints={dragConstraintsRef}
      dragMomentum={false}
      dragElastic={0}
      // initial={{
      //   x: initalX,
      //   y: initalY,
      // }}
      onDragEnd={(event, info) => {
        console.info("old X: ", Number(info.point.x.toFixed(0)));
        console.log("factor: ", dragConstraintsRef.current.offsetWidth / 100);
        console.info("old Y: ", Number(info.point.y.toFixed(0)));
        console.warn("new X: ", Number(info.point.x.toFixed(0)) / (dragConstraintsRef.current.offsetWidth / 100));
        console.warn("new Y: ", Number(info.point.y.toFixed(0)) / (dragConstraintsRef.current.offsetHeight / 100));
        onPositionUpdate(
          // keine Nachkommastellen.
          Number(info.point.x.toFixed(0)) / (dragConstraintsRef.current.offsetWidth / 100),
          Number(info.point.y.toFixed(0)) / (dragConstraintsRef.current.offsetHeight / 100),
          positionId
        );
      }}
      style={{
        position: "absolute",
        display: "inline-flex",
        zIndex: 1,
        boxShadow: shadow ? "3px 3px 3px " + shadow : "",
        x,
        y,
        scaleX,
        scaleY,
      }}
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
