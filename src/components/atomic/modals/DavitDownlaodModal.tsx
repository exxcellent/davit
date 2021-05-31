import React, { FunctionComponent } from "react";
import { DavitDownloadForm } from "../../common/fragments/forms/DavitDownloadForm";
import { DavitModal } from "./DavitModal";

interface DavitDownloadModalProps {
    closeCallback: () => void;
}

export const DavitDownloadModal: FunctionComponent<DavitDownloadModalProps> = (props) => {
    const {closeCallback} = props;

    return (
        <DavitModal>
            <DavitDownloadForm onCloseCallback={closeCallback} />
        </DavitModal>
    );
};
