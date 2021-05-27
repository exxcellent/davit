import React, { CSSProperties, ReactNode } from "react";
import { Bar, BarProps } from "./Bar";

export interface PredefinedBarProps {
    /**
     * Predefined bar heights
     */
    height?: "large" | "medium" | "small"
    /**
     * Predefined bar position: "left"  with aligned contents: "left"
     */
    left?: ReactNode
    /**
     * Predefined bar position: "middle" with aligned contents: "center"
     */
    middle?: ReactNode
    /**
     * Predefined bar position: "right" with aligned contents: "right"
     */
    right?: ReactNode
    /**
     * The React children are positioned between the "left" and the "middle" bar position.
     */
    children?: ReactNode
    /**
     * Custom style definition
     */
    style?: CSSProperties;
}

export const PrimaryBar: React.FC<PredefinedBarProps> = (props: PredefinedBarProps) => {
    const barProps: BarProps = {...props, color: "primary"};

    return <Bar {...barProps} />;
};
