import React, { FunctionComponent } from 'react';
import { Button } from 'semantic-ui-react';

interface DavitButtonIconProps {
    onClick: () => void;
    icon?: string;
    disable?: boolean;
}

interface DavitButtonLabelProps {
    onClick: () => void;
    label: string;
    disable?: boolean;
}

export const DavitButtonIcon: FunctionComponent<DavitButtonIconProps> = (props) => {
    const { onClick, icon, disable } = props;

    return <Button icon={icon} onClick={onClick} className="carv2Button" inverted color="orange" disabled={disable} />;
};

export const DavitButtonLabel: FunctionComponent<DavitButtonLabelProps> = (props) => {
    const { onClick, label, disable } = props;

    return (
        <button onClick={onClick} disabled={disable} style={{ opacity: disable ? '0.7' : '1' }}>
            <label>{label}</label>
        </button>
    );
};
