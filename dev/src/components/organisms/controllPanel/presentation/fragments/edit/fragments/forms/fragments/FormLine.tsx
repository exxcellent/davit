import React, { FunctionComponent } from "react";

export interface FormLineProps {
}

export const FormLine: FunctionComponent<FormLineProps> = (props) => {
    const {children} = props;

    return (
        <div className={"flex content-space-around padding-horizontal-medium width-fluid"}>
            {children}
        </div>
    );
};
