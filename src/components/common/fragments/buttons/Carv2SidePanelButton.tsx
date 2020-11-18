import React, { FunctionComponent } from 'react';
import { Icon, SemanticICONS } from 'semantic-ui-react';

interface Carv2ButtonIconProps {
    onClick: () => void;
    icon?: SemanticICONS;
    active?: boolean;
}

export const Carv2SidePanelButton: FunctionComponent<Carv2ButtonIconProps> = (props) => {
    const { onClick, icon, active } = props;

    return (
        <div className={'carv2SidePanelButton' + (active ? ' SidePanelButtonActive' : '')} onClick={onClick}>
            <Icon name={icon} />
        </div>
    );
};
