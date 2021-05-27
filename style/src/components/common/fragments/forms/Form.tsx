import React, { FunctionComponent } from "react";

export interface FormProps {
}

export const Form: FunctionComponent<FormProps> = (props) => {
    const {children} = props;

    return (
        <div className={"form"}>
            {children}
        </div>
    );
};
