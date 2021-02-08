import React, { FunctionComponent } from "react";

interface DavitButtonGroupProps {}

export const DavitButtonGroup: FunctionComponent<DavitButtonGroupProps> = (props) => {
    const { children } = props;

    return <div className="ButtonGroup">{children}</div>;
};
