import React, { FunctionComponent } from "react";

interface TabGroupFragmentProps {
    label: string;
}

export const TabGroupFragment: FunctionComponent<TabGroupFragmentProps> = (props) => {
    const { label, children } = props;
    return (
        <div className='tab-group'>
            <div className='tab-aggregator'>{label}</div>
            <div style={{ display: 'flex' }}>
                {children}
            </div>
        </div>
    )
}