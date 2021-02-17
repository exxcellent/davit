import { faReply } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent } from "react";
import { DavitButton } from "./DavitButton";

interface DavitBackButtonProps {
    onClick: () => void;
}

export const DavitBackButton: FunctionComponent<DavitBackButtonProps> = (props) => {
    const { onClick } = props;

    return <DavitButton onClick={onClick} iconName={faReply} />;
};
