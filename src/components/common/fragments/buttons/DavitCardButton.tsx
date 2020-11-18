import React, { FunctionComponent } from 'react';
import { Icon, SemanticICONS } from 'semantic-ui-react';

interface DavitCardButtonProps {
    onClick: () => void;
    disable?: boolean;
    icon?: SemanticICONS;
    isActive?: boolean;
}

export const DavitCardButton: FunctionComponent<DavitCardButtonProps> = (props) => {
    const { onClick, disable, icon, isActive } = props;

    return (
        <button
            onClick={onClick}
            className={'Carv2CardButton' + (isActive ? ' activeButton' : '') + (disable ? ' disabled' : '')}
            disabled={disable}>
            <Icon size="small" name={icon} />
        </button>
    );
};
