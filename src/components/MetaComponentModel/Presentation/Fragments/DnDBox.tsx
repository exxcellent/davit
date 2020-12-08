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

    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => setKey((prevState) => prevState + 1);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (constraintsRef !== null && constraintsRef.current !== null) {
            svgElements.map((svg) => {
                let svgWithRef: DavitPathProps = svg;
                svgWithRef.xSource = svg.xSource * (constraintsRef.current!.offsetWidth / 100);
                svgWithRef.ySource = svg.ySource * (constraintsRef.current!.offsetHeight / 100);
                svgWithRef.xTarget = svg.xTarget * (constraintsRef.current!.offsetWidth / 100);
                svgWithRef.yTarget = svg.yTarget * (constraintsRef.current!.offsetHeight / 100);
            });
            setKey((key) => key + 1);
        }
    }, [svgElements, constraintsRef]);

    const createDavitPath = () => {
        return svgElements.map((svg, index) => {
            return <DavitPath {...svg} key={index} />;
        });
    };

    return (
        <motion.div
            onMouseEnter={(event) => setMouseOver(true)}
            onMouseLeave={(event) => setMouseOver(false)}
            ref={constraintsRef}
            // style={fullScreen ? { height: height, maxWidth: width } : {}}
            className={fullScreen ? type.toString() + 'Fullscreen' : type.toString()}
            key={key}>
            {toDnDElements.map(wrappItem)}
            <motion.svg className="dataSVGArea" key={key}>
                {createDavitPath()}
            </motion.svg>
        </motion.div>
    );
};
