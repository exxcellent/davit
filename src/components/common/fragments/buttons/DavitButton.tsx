import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent } from "react";

interface DavitButtonLabelProps {
    onClick: () => void;
    label?: string;
    disable?: boolean;
    iconName?: IconDefinition;
    className?: string;
}

export const DavitButton: FunctionComponent<DavitButtonLabelProps> = (props) => {
    const { onClick, label, disable, iconName, className } = props;

    return (
        <button className={className} onClick={onClick} disabled={disable} style={{ opacity: disable ? "0.7" : "1" }}>
            {label && <label>{label}</label>}
            {iconName && <FontAwesomeIcon icon={iconName} />}
        </button>
    );
};
