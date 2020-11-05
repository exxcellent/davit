import {motion} from 'framer-motion';
import React, {FunctionComponent, useEffect, useRef, useState} from 'react';

import {ASPECT_RATIO, WINDOW_FACTOR} from '../../../../app/Carv2Constants';
import {PositionTO} from '../../../../dataAccess/access/to/PositionTO';
import {useCurrentHeight, useCurrentWitdh} from '../../../../utils/WindowUtil';
import {createDnDItem} from '../../../common/fragments/DnDWrapper';
import {Arrow, createCurveArrow} from '../../../common/fragments/svg/Arrow';

interface ActorDnDBox {
  toDnDElements: { element: JSX.Element; position: PositionTO }[];
  arrows: Arrow[];
  fullScreen?: boolean;
  onPositionUpdate: (x: number, y: number, positionId: number) => void;
}

export const ActorDnDBox: FunctionComponent<ActorDnDBox> = (props) => {
  const {arrows, fullScreen, toDnDElements, onPositionUpdate} = props;
  const {constraintsRef, key, height, width} = useActorDnDBoxViewModel();

  const wrappItem = (toDnDElement: { element: JSX.Element; position: PositionTO }): JSX.Element => {
    return createDnDItem(toDnDElement.position, onPositionUpdate, constraintsRef, toDnDElement.element);
  };

  return (
    <motion.div
      id="dndBox"
      ref={constraintsRef}
      style={fullScreen ? {height: height, maxWidth: width} : {}}
      className={fullScreen ? 'actorModelFullscreen' : 'actorModel'}
      key={key}
    >
      {toDnDElements.map(wrappItem)}
      <motion.svg className="dataSVGArea">
        {arrows.map((arrow, index) => {
          return createCurveArrow(
              arrow.sourceGeometricalData,
              arrow.targetGeometricalData,
              arrow.dataLabels,
              index,
              constraintsRef,
          );
        })}
      </motion.svg>
    </motion.div>
  );
};

const useActorDnDBoxViewModel = () => {
  const [key, setKey] = useState<number>(0);
  const constraintsRef = useRef<HTMLInputElement>(null);

  const currentWindowWitdh: number = useCurrentWitdh();
  const currentWindowHeight: number = useCurrentHeight();
  const newWindowHeight: number = (currentWindowWitdh / WINDOW_FACTOR) * ASPECT_RATIO;
  const newWindowWitdh: number = (currentWindowHeight / ASPECT_RATIO) * WINDOW_FACTOR;

  useEffect(() => {
    const handleResize = () => setKey((prevState) => prevState + 1);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    constraintsRef,
    height: newWindowHeight,
    width: newWindowWitdh,
    key,
  };
};
