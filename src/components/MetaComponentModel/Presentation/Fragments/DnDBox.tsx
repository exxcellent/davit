import { motion } from 'framer-motion';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { ASPECT_RATIO, WINDOW_FACTOR } from '../../../../app/DavitConstants';
import { GeometricalDataTO } from '../../../../dataAccess/access/to/GeometricalDataTO';
import { PositionTO } from '../../../../dataAccess/access/to/PositionTO';
import { useCurrentHeight, useCurrentWitdh } from '../../../../utils/WindowUtil';
import { createDnDItem } from '../../../common/fragments/DnDWrapper';
import { DavitPath, DavitPathProps } from '../../../common/fragments/svg/DavitPath';

export interface DnDBoxElement {
    element: JSX.Element;
    position: PositionTO;
    geometricalData?: GeometricalDataTO;
}

interface DnDBox {
    toDnDElements: DnDBoxElement[];
    svgElements: DavitPathProps[];
    fullScreen?: boolean;
    onPositionUpdate: (x: number, y: number, positionId: number) => void;
    onGeoUpdate?: (width: number, height: number, geoId: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    type: DnDBoxType;
}

export enum DnDBoxType {
    actor = 'actorModel',
    data = 'dataModel',
}

export const DnDBox: FunctionComponent<DnDBox> = (props) => {
    const { fullScreen, toDnDElements, onPositionUpdate, zoomIn, zoomOut, type, svgElements, onGeoUpdate } = props;

    const { key, setKey, constraintsRef } = useDnDBoxViewModel();

    // const constraintsRef = useRef<HTMLDivElement>(null);

    const [mouseOver, setMouseOver] = useState<boolean>(false);
    // TODO: activate if arrows draw with ref's.
    // useCustomZoomEvent({ zoomInCallBack: zoomIn, zoomOutCallBack: zoomOut }, mouseOver);

    const wrappItem = (toDnDElement: DnDBoxElement): JSX.Element => {
        return createDnDItem(
            toDnDElement.position,
            onPositionUpdate,
            constraintsRef,
            toDnDElement.element,
            undefined,
            toDnDElement.geometricalData?.id || undefined,
            onGeoUpdate,
        );
    };

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
    }, [svgElements, constraintsRef, setKey]);

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
            // key={key}
        >
            {toDnDElements.map(wrappItem)}
            <motion.svg className="dataSVGArea" key={key}>
                {createDavitPath()}
            </motion.svg>
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
        setKey,
    };
};
