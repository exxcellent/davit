import { motion } from 'framer-motion';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { ASPECT_RATIO, WINDOW_FACTOR } from '../../../../app/Carv2Constants';
import { PositionTO } from '../../../../dataAccess/access/to/PositionTO';
import { useCurrentHeight, useCurrentWitdh, useCustomZoomEvent } from '../../../../utils/WindowUtil';
import { createDnDItem } from '../../../common/fragments/DnDWrapper';
import { Arrow, createCurveArrow } from '../../../common/fragments/svg/Arrow';
import { createCornerConnection, DavitPath } from '../../../common/fragments/svg/DavitPath';

interface DnDBox {
    toDnDElements: { element: JSX.Element; position: PositionTO }[];
    paths: Arrow[] | DavitPath[];
    fullScreen?: boolean;
    onPositionUpdate: (x: number, y: number, positionId: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    type: DnDBoxType;
}

export enum DnDBoxType {
    actor = 'actorModel',
    data = 'dataModel',
}

export const DnDBox: FunctionComponent<DnDBox> = (props) => {
    const { paths, fullScreen, toDnDElements, onPositionUpdate, zoomIn, zoomOut, type } = props;
    const { constraintsRef, key, height, width } = useDnDBoxViewModel();

    const [mouseOver, setMouseOver] = useState<boolean>(false);
    useCustomZoomEvent({ zoomInCallBack: zoomIn, zoomOutCallBack: zoomOut }, mouseOver);

    const wrappItem = (toDnDElement: { element: JSX.Element; position: PositionTO }): JSX.Element => {
        return createDnDItem(toDnDElement.position, onPositionUpdate, constraintsRef, toDnDElement.element);
    };

    const drawLines = (lines: Arrow[] | DavitPath[]) => {
        if (lines.length > 0) {
            if ((lines as Arrow[])[0].dataLabels) {
                return (lines as Arrow[]).map((arrow: Arrow, index: number) => {
                    return createCurveArrow(
                        arrow.sourceGeometricalData,
                        arrow.targetGeometricalData,
                        arrow.dataLabels,
                        index,
                        constraintsRef,
                    );
                });
            }
            if ((lines as DavitPath[])[0].dataRelation) {
                return (lines as DavitPath[]).map((path, index) => {
                    return createCornerConnection(
                        path.source,
                        path.target,
                        path.dataRelation,
                        path.dataRelation.id,
                        constraintsRef,
                        path.isEdit,
                    );
                });
            }
        }
    };

    return (
        <motion.div
            onMouseEnter={(event) => setMouseOver(true)}
            onMouseLeave={(event) => setMouseOver(false)}
            ref={constraintsRef}
            style={fullScreen ? { height: height, maxWidth: width } : {}}
            className={fullScreen ? type.toString() + 'Fullscreen' : type.toString()}
            key={key}>
            {toDnDElements.map(wrappItem)}
            <motion.svg className="dataSVGArea">{drawLines(paths)}</motion.svg>
        </motion.div>
    );
};

const useDnDBoxViewModel = () => {
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
