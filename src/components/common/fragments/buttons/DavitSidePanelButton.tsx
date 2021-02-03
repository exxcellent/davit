import React, { FunctionComponent } from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";

interface DavitButtonIconProps {
    onClick: () => void;
    icon?: SemanticICONS;
    active?: boolean;
}

export const DavitSidePanelButton: FunctionComponent<DavitButtonIconProps> = (props) => {
    const { onClick, icon, active } = props;

    return (
        <div className={"carv2SidePanelButton" + (active ? " SidePanelButtonActive" : "")} onClick={onClick}>
            <Icon name={icon} />
        </div>
    );
};
