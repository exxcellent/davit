import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent } from "react";
import { DavitButton } from "./DavitButton";

interface DavitAddButtonProps {
    onClick: () => void;
}

export const DavitAddButton: FunctionComponent<DavitAddButtonProps> = (props) => {
    const { onClick } = props;

    return <DavitButton onClick={onClick} iconName={faPlus} />;
};
