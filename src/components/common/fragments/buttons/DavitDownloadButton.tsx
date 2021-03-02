import {faDownload} from "@fortawesome/free-solid-svg-icons";
import React, {FunctionComponent, useState} from "react";
import {DavitButton} from "./DavitButton";
import {DavitDownloadModal} from "../modals/DavitDownlaodModal";

export interface DavitDownloadButtonProps {
}

export const DavitDownloadButton: FunctionComponent<DavitDownloadButtonProps> = () => {
    const [showForm, setShowForm] = useState<boolean>(false);

    return (
        <>
            <DavitButton onClick={() => setShowForm(true)} iconName={faDownload}/>
            {showForm && <DavitDownloadModal closeCallback={() => setShowForm(false)}/>}
        </>
    );
};
