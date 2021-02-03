import React, { FunctionComponent } from "react";
import { Button, IconProps, SemanticShorthandItem } from "semantic-ui-react";

interface DavitTableButtonProps {
    onClick: () => void;
    disable?: boolean;
    icon?: SemanticShorthandItem<IconProps>;
}

export const DavitTableButton: FunctionComponent<DavitTableButtonProps> = (props) => {
    const { onClick, icon, disable } = props;

    return (
        <Button icon={icon} onClick={onClick} className="carv2TableButton" inverted color="orange" disabled={disable} />
    );
};
