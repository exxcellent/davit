import { motion } from 'framer-motion';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { PositionTO } from '../../../../dataAccess/access/to/PositionTO';
import { createDnDItem } from '../../../common/fragments/DnDWrapper';
import { DavitPath, DavitPathProps } from '../../../common/fragments/svg/DavitPath';

export interface DnDBoxElement {
    element: JSX.Element;
    position: PositionTO;
}

interface DnDBox {
    toDnDElements: DnDBoxElement[];
    svgElements: DavitPathProps[];
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
    const { fullScreen, toDnDElements, onPositionUpdate, zoomIn, zoomOut, type, svgElements } = props;
    const constraintsRef = useRef<HTMLDivElement>(null);

    const [mouseOver, setMouseOver] = useState<boolean>(false);
    // TODO: activate if arrows draw with ref's.
    // useCustomZoomEvent({ zoomInCallBack: zoomIn, zoomOutCallBack: zoomOut }, mouseOver);

    const wrappItem = (toDnDElement: { element: JSX.Element; position: PositionTO }): JSX.Element => {
        return createDnDItem(toDnDElement.position, onPositionUpdate, constraintsRef, toDnDElement.element);
    };

    // const drawLines = (lines: Arrow[] | DavitPath[]) => {
    //     if (lines.length > 0) {
    //         if ((lines as Arrow[])[0].dataLabels) {
    //             return (lines as Arrow[]).map((arrow: Arrow, index: number) => {
    //                 return createArrow(
    //                     arrow.sourceGeometricalData,
    //                     arrow.targetGeometricalData,
    //                     index,
    //                     constraintsRef,
    //                     arrow.type,
    //                     arrow.dataLabels,
    //                 );
    //             });
    //         }
    //         if ((lines as DavitPath[])[0].dataRelation) {
    //             return (lines as DavitPath[]).map((path, index) => {
    //                 return createCornerConnection(
    //                     path.source,
    //                     path.target,
    //                     path.dataRelation,
    //                     path.dataRelation.id,
    //                     constraintsRef,
    //                     path.isEdit,
    //                 );
    //             });
    //         }
    //     }
    // };

    // const [initXSource, setInitXSource] = useState<number>(xSource * (parentRef.current.offsetWidth / 100));
    // const [initYSource, setInitYSource] = useState<number>(ySource * (parentRef.current.offsetHeight / 100));
    // const [initXTarget, setInitXTarget] = useState<number>(xTarget * (parentRef.current.offsetWidth / 100));
    // const [initYTarget, setInitYTarget] = useState<number>(yTarget * (parentRef.current.offsetHeight / 100));

    useEffect(() => {
        if (constraintsRef !== null && constraintsRef.current !== null) {
            console.info('call useEffect!');
            svgElements.map((svg) => {
                let svgWithRef: DavitPathProps = svg;
                svgWithRef.xSource = svg.xSource * (constraintsRef.current!.offsetWidth / 100);
                svgWithRef.ySource = svg.ySource * (constraintsRef.current!.offsetHeight / 100);
                svgWithRef.xTarget = svg.xTarget * (constraintsRef.current!.offsetWidth / 100);
                svgWithRef.yTarget = svg.yTarget * (constraintsRef.current!.offsetHeight / 100);
            });
        }
    }, [svgElements, constraintsRef]);

    return (
        <motion.div
            onMouseEnter={(event) => setMouseOver(true)}
            onMouseLeave={(event) => setMouseOver(false)}
            ref={constraintsRef}
            // style={fullScreen ? { height: height, maxWidth: width } : {}}
            className={fullScreen ? type.toString() + 'Fullscreen' : type.toString()}>
            {toDnDElements.map(wrappItem)}
            <motion.svg className="dataSVGArea">
                {svgElements.map((svg, index) => {
                    return <DavitPath {...svg} id={index} key={index} />;
                })}
            </motion.svg>
        </motion.div>
    );
};

// const useDnDBoxViewModel = () => {
//     const currentWindowWitdh: number = useCurrentWitdh();
//     const currentWindowHeight: number = useCurrentHeight();
//     const newWindowHeight: number = (currentWindowWitdh / WINDOW_FACTOR) * ASPECT_RATIO;
//     const newWindowWitdh: number = (currentWindowHeight / ASPECT_RATIO) * WINDOW_FACTOR;

//     useEffect(() => {
//         const handleResize = () => setKey((prevState) => prevState + 1);
//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     return {
//         height: newWindowHeight,
//         width: newWindowWitdh,
//     };
// };
