import React, { FunctionComponent } from 'react';

export interface OptionFieldProps {
    label?: string;
}

export const OptionField: FunctionComponent<OptionFieldProps> = (props) => {
    const { label, children } = props;

    return (
        <div className="optionFieldAround">
            <div className="optionField">{children}</div>
            {label && <div className="optionFieldLabel">{label.toUpperCase()}</div>}
        </div>
    );
};
