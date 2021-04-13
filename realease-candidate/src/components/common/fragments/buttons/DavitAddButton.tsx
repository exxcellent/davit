import React, { CSSProperties, FunctionComponent } from 'react';
import { DavitButton } from './DavitButton';
import { DavitIcons } from '../../IconSet';

interface DavitAddButtonProps {
    onClick: () => void;
    style?: CSSProperties;
}

export const DavitAddButton: FunctionComponent<DavitAddButtonProps> = (props) => {
    const { onClick, style } = props;

    return <DavitButton onClick={onClick} iconName={DavitIcons.plus} style={style}/>;
};
