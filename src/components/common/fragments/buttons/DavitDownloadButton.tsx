import { faDownload } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent } from "react";
import { DavitButton } from "./DavitButton";

interface DavitDownloadButtonProps {
    onClick: () => void;
}

export const DavitDownloadButton: FunctionComponent<DavitDownloadButtonProps> = (props) => {
    const { onClick } = props;

    return <DavitButton onClick={onClick} iconName={faDownload} />;
};
