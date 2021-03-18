import React, { FunctionComponent } from "react";

interface CenteredFlexProps {

}

export const CenteredFlex: FunctionComponent<CenteredFlexProps> = (props) => {
    const { children } = props;

    return (
        <div className={"centeredFlex"}>{children}</div>
    );
};
