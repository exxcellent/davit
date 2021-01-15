import React, { FunctionComponent } from 'react';
import { Icon } from 'semantic-ui-react';

interface DavitCardMainButtonProps {
    onClick: () => void;
    disable?: boolean;
}

export const DavitCardMainButton: FunctionComponent<DavitCardMainButtonProps> = (props) => {
    const { onClick, disable } = props;

    return (
        <button
            onClick={onClick}
            className={
                disable !== undefined && disable === true ? 'Carv2CardMainButton disabled' : 'Carv2CardMainButton'
            }
            disabled={disable}>
            <Icon name="caret up" size="tiny" />
        </button>
    );
};
