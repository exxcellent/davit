import React, { FunctionComponent } from 'react';

interface Carv2ButtonGroupProps {}

export const Carv2ButtonGroup: FunctionComponent<Carv2ButtonGroupProps> = (props) => {
    const { children } = props;

    return <div className="ButtonGroup">{children}</div>;
};
