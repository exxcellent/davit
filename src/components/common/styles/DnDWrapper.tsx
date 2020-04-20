import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

export interface DnDWrapperProps {
  constraintsRef: any;
  initalX: number;
  initalY: number;
}

export const DnDWrapper: FunctionComponent<DnDWrapperProps> = (props) => {
  const { constraintsRef, initalX, initalY } = props;

  console.info("DnDItem rendering!");
  /**
   * inital X und Y dürfen nicht null oder undefin sein, sonst kann das Objekt nicht bewegt werden!
   *
   * TODO: Funktioniert nicht da die DnDItems schneller gerendert werden als der State richtig gestetzt werden kann!
   * LÖSUNG: Im Parent die Gültichkeit der Props überprüfen?
   **/

  // const [posX, setPosX] = React.useState<number>(0);
  // const [posY, setPosY] = React.useState<number>(0);

  // useEffect(() => {
  //   if (!isNullOrUndefined(initalX)) {
  //     setPosX(initalX);
  //     console.warn("Set X to:" + initalX);
  //   }
  //   if (!isNullOrUndefined(initalY)) {
  //     setPosX(initalY);
  //     console.warn("Set Y to:" + initalY);
  //   }
  // }, [initalX, initalY, setPosX, setPosY]);

  return (
    <DnDiv
      drag={true}
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: initalX, y: initalY }}
      onDragEnd={(event, info) => {
        //TODO: hier müssen die neuen x|y werte an die PositionTO übergeben werden!
        console.log(info.point.x);
        console.log(info.point.y);
      }}
    >
      {props.children}
    </DnDiv>
  );
};

// Styling
const DnDiv = styled(motion.div)`
  position: absolute;
  /* border-color: black;
  border-style: solid; */
`;
