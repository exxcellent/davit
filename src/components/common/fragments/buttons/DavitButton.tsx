import {IconDefinition} from "@fortawesome/fontawesome-common-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {CSSProperties, FunctionComponent} from 'react';

interface DavitButtonProps {
    onClick: () => void;
    label?: string;
    disable?: boolean;
    iconName?: IconDefinition;
    className?: string;
    style?: CSSProperties;
}

export const DavitButton: FunctionComponent<DavitButtonProps> = (props) => {
    const {onClick, label, disable, iconName, className, style} = props;

    return (
        <button className={className} onClick={onClick} disabled={disable} style={style}>
            {label && <label>{label}</label>}
            {iconName && <FontAwesomeIcon icon={iconName}/>}
        </button>
    );
};
