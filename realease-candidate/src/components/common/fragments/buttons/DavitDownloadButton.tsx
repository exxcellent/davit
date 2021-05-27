import { faDownload } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent, useState } from "react";
import { DavitDownloadModal } from "../modals/DavitDownlaodModal";
import { DavitButton } from "./DavitButton";

export interface DavitDownloadButtonProps {
}

export const DavitDownloadButton: FunctionComponent<DavitDownloadButtonProps> = () => {
    const [showForm, setShowForm] = useState<boolean>(false);

    return (
        <>
            <DavitButton onClick={() => setShowForm(true)}
                         iconName={faDownload}
            />
            {showForm && <DavitDownloadModal closeCallback={() => setShowForm(false)} />}
        </>
    );
};
