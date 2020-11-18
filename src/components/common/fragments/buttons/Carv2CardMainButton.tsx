import React, { FunctionComponent } from 'react';
import { Icon } from 'semantic-ui-react';

interface Carv2CardMainButtonProps {
    onClick: () => void;
    disable?: boolean;
}

export const Carv2CardMainButton: FunctionComponent<Carv2CardMainButtonProps> = (props) => {
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
