import React, { FunctionComponent } from 'react';
import { DavitButton } from './DavitButton';
import { DavitIcons } from '../../IconSet';

interface DavitBackButtonProps {
    onClick: () => void;
}

export const DavitBackButton: FunctionComponent<DavitBackButtonProps> = (props) => {
    const { onClick } = props;

    return <DavitButton onClick={onClick} iconName={DavitIcons.back} />;
};
