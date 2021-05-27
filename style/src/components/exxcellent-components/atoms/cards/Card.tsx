import React, { CSSProperties, ReactNode } from "react";
import "./Card.css";

export const cardTypes = {
    "normal": "normal",
    "outlined": "outlined"
};

export interface CardProps {
    /**
     * Different card types
     */
    type?: keyof typeof cardTypes
    /**
     * The React children of the Card
     */
    children?: ReactNode
    /**
     * Custom style definition
     */
    style?: CSSProperties;
}

export const Card: React.FC<CardProps> = ({
                                              type = "normal",
                                              children,
                                              style,
                                              ...props
                                          }) => {
    return (
        <div className={["card", type].join(" ")}
             style={style}
        >
            {children}
        </div>
    );
};
