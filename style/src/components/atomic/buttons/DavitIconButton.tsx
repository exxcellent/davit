import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent } from "react";
import { ElementSize } from "../../../style/Theme";
import { DavitButton, DavitButtonProps } from "./DavitButton";
import "./DavitButton.css";
import "./DavitIconButton.css";

interface DavitIconButtonProps extends DavitButtonProps {
    iconName?: IconDefinition;
    iconLeft?: boolean;
    size?: ElementSize;
}

export const DavitIconButton: FunctionComponent<DavitIconButtonProps> = (props) => {
    const {onClick, size, className = "", iconName, children} = props;

    return (
        <DavitButton onClick={onClick}
                     size={size}
                     className={className}
        >
            {iconName && <FontAwesomeIcon className={children ? "iconButtonIcon" : ""} icon={iconName} />}
            {children}
        </DavitButton>
    );
};
