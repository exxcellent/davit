import React, { FunctionComponent } from 'react';

interface ViewPlaceholderProps {
    text: string
    className?: string
}

export const ViewPlaceholder: FunctionComponent<ViewPlaceholderProps> = (props) => {
    const { text, className } = props;

    return (
        <div className={className}>
            <div className={'viewPlaceholder'}>
                <h2>{text}</h2>
            </div>
        </div>
    );
};
