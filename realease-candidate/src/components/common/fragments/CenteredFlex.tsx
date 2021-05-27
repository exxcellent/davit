import React, { FunctionComponent } from "react";

interface CenteredFlexProps {
    className?: string
}

export const CenteredFlex: FunctionComponent<CenteredFlexProps> = (props) => {
    const {children, className} = props;

    return (
        <div className={className ? `centeredFlex ${className}` : "centeredFlex"}>{children}</div>
    );
};
