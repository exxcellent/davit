import { motion, Point } from 'framer-motion';
import React, { FunctionComponent } from 'react';
import { GeometricalDataCTO } from '../../../../dataAccess/access/cto/GeometraicalDataCTO';

export interface ArrowProps {
    xSource: number;
    ySource: number;
    sourceWidth: number;
    sourceHeight: number;
    xTarget: number;
    yTarget: number;
    targetWidth: number;
    targetHeight: number;
    type: ArrowType;
    dataLabels: string[];
}

export interface Arrow {
    sourceGeometricalData: GeometricalDataCTO;
    targetGeometricalData: GeometricalDataCTO;
    dataLabels: string[];
    type: ArrowType;
}

export enum ArrowType {
    SEND = 'SEND',
    TRIGGER = 'TRIGGER',
}

const Arrow: FunctionComponent<ArrowProps> = (props) => {
    const {
        xSource,
        ySource,
        xTarget,
        yTarget,
        type,
        // sourceHeight,
        sourceWidth,
        targetHeight,
        dataLabels,
    } = props;

    // TODO: measure real width of elements.
    // const ELEMENT_WIDTH = 120;
    const INTERFACE_INPUT: Point = { x: 0, y: targetHeight / 2 };
    // const INTERFACE_OUTPUT: Point = { x: ELEMENT_WIDTH, y: sourceHeight / 2 };
    const OFFSET: number = 10;
    const MARKER_WIDTH: number = 20;
    const TEXT_OFFSET: number = 25;

    const createCurve = (x1: number, y1: number, x2: number, y2: number, type: ArrowType) => {
        const startDir: 'LEFT' | ' RIGHT' = x2 < x1 + sourceWidth / 2 ? 'LEFT' : ' RIGHT';
        const endDir: 'LEFT' | ' RIGHT' = x1 < x2 + sourceWidth / 2 ? 'LEFT' : ' RIGHT';
        const xStart = startDir === 'LEFT' ? x1 : x1 + sourceWidth;
        const xEnd = endDir === 'LEFT' ? x2 : x2 + sourceWidth + OFFSET + MARKER_WIDTH;
        let startPoint: Point = { x: xStart, y: y1 };
        let endPoint: Point = { x: xEnd, y: y2 };
        // set interfaces
        startPoint = plusPoint(startPoint, INTERFACE_INPUT);
        endPoint = plusPoint(endPoint, INTERFACE_INPUT);
        // add object offset
        const offsetStartPoint = setOutPutOffset(startPoint, OFFSET, startDir);
        endPoint = setInputPutOffset(endPoint, OFFSET);

        const middlePoint = getMiddlePoint(offsetStartPoint, endPoint);
        const curveRefPoint = getCurvRefPoint(offsetStartPoint, middlePoint);
        const offsetStartSign = startDir === 'LEFT' ? '-' : '';
        const offsetEndSign = endDir === 'LEFT' ? '' : '-';

        return (
            <>
                <path
                    d={`M ${startPoint.x},${startPoint.y} 
        l ${offsetStartSign}10,0
        Q ${curveRefPoint.x}, 
        ${curveRefPoint.y} 
        ${middlePoint.x}, 
        ${middlePoint.y}
        T ${endPoint.x}, ${endPoint.y}
        l ${offsetEndSign}10,0
        `}
                    className={'carvPath ' + type.toString()}
                    markerEnd="url(#arrow)"
                />
                {dataLabels.map((label, index) => {
                    return (
                        <>
                            <text
                                key={index}
                                x={middlePoint.x - TEXT_OFFSET}
                                y={middlePoint.y + index * 20}
                                className="davitArrowTextBG">
                                {label}
                            </text>
                            <text
                                key={index}
                                x={middlePoint.x - TEXT_OFFSET}
                                y={middlePoint.y + index * 20}
                                className="davitArrowText">
                                {label}
                            </text>
                        </>
                    );
                })}
            </>
        );
    };

    const getMiddleValue = (val1: number, val2: number): number => {
        const middleValue = (val2 - val1) / 2 + val1;
        return middleValue;
    };

    const setOutPutOffset = (point: Point, offset: number, startDir: 'LEFT' | ' RIGHT'): Point => {
        return startDir === 'LEFT' ? { x: point.x - offset, y: point.y } : { x: point.x + offset, y: point.y };
    };

    const setInputPutOffset = (point: Point, offset: number): Point => {
        return { x: point.x - offset, y: point.y };
    };

    const plusPoint = (point1: Point, point2: Point): Point => {
        return { x: point1.x + point2.x, y: point1.y + point2.y };
    };

    const getMiddlePoint = (startPoint: Point, endPoint: Point): Point => {
        return {
            x: getMiddleValue(startPoint.x, endPoint.x),
            y: getMiddleValue(startPoint.y, endPoint.y),
        };
    };

    const getCurvRefPoint = (curveStartPoint: Point, curveEndPoint: Point): Point => {
        return {
            x: getMiddleValue(curveStartPoint.x, curveEndPoint.x),
            y: curveStartPoint.y,
        };
    };

    return (
        <motion.svg className="componentSVGArea">
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" strokeWidth="0">
                    <path d="M0,0 L0,6 L9,3 z" className="carvArrowMarker" />
                </marker>
            </defs>
            {createCurve(xSource, ySource, xTarget, yTarget, type)}
        </motion.svg>
    );
};

export const createArrow = (
    source: GeometricalDataCTO | undefined,
    target: GeometricalDataCTO | undefined,
    key: number,
    type: ArrowType,
    dataLabels?: string[],
): JSX.Element | undefined => {
    if (source && target) {
        return (
            <Arrow
                xSource={source.position.x}
                ySource={source.position.y}
                sourceWidth={source.geometricalData.width}
                sourceHeight={source.geometricalData.height}
                xTarget={target.position.x}
                yTarget={target.position.y}
                targetWidth={target.geometricalData.width}
                targetHeight={target.geometricalData.height}
                type={type}
                key={key}
                dataLabels={dataLabels || []}
            />
        );
    }
};
