import React, { FunctionComponent } from 'react';
import { DavitModal } from './DavitModal';
import { DavitDownloadForm } from '../forms/DavitDownloadForm';

interface DavitDownloadModalProps {
    closeCallback: () => void;
}

export const DavitDownloadModal: FunctionComponent<DavitDownloadModalProps> = (props) => {
    const { closeCallback } = props;

    return (
        <DavitModal>
            <DavitDownloadForm onCloseCallback={closeCallback} />
        </DavitModal>
    );
};
