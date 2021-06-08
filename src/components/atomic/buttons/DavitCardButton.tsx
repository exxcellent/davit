import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import React, { FunctionComponent } from "react";
import { DavitButton } from "./DavitButton";

interface DavitCardButtonProps {
    onClick: () => void;
    disable?: boolean;
    icon: IconDefinition;
    isActive?: boolean;
}

export const DavitCardButton: FunctionComponent<DavitCardButtonProps> = (props) => {
    const {onClick, disable, icon, isActive} = props;

    return (
        <DavitButton
            onClick={onClick}
            className={`padding-tiny border ${isActive ? "activeButton" : ""}`}
            disable={disable}
            iconName={icon}
        >
        </DavitButton>
    );
};
