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
        // <button className={"sidePanelButton" + (active ? " SidePanelButtonActive" : "")} onClick={onClick}>
        <button className={"sidePanelButton" + (active ? " active" : "")} onClick={onClick}>
            <Icon name={icon} />
        </button>
    );
};
