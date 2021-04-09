import React, { CSSProperties, FunctionComponent } from 'react';
import { DavitButton } from './DavitButton';
import { faWrench } from '@fortawesome/free-solid-svg-icons/faWrench';

interface DavitEditButtonProps {
    onClick: () => void;
    style?: CSSProperties;
}

export const DavitEditButton: FunctionComponent<DavitEditButtonProps> = (props) => {
    const { onClick, style } = props;

    return <DavitButton onClick={onClick} iconName={faWrench} style={style}/>;
};
