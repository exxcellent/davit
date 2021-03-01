import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { CSSProperties, FunctionComponent } from 'react';
import { DavitButton } from "./DavitButton";

interface DavitAddButtonProps {
    onClick: () => void;
    style?: CSSProperties;
}

export const DavitAddButton: FunctionComponent<DavitAddButtonProps> = (props) => {
    const { onClick, style } = props;

    return <DavitButton onClick={onClick} iconName={faPlus} style={style}/>;
};
