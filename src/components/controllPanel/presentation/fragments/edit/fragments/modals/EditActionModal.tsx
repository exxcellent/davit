import React, { FunctionComponent } from 'react';
import { ActionForm } from '../forms/ActionForm';
import { DavitModal } from '../../../../../../common/fragments/modals/DavitModal';

interface EditActionModalProps {

}

export const EditActionModal: FunctionComponent<EditActionModalProps> = () => {

    return (
        <DavitModal>
            <ActionForm />
        </DavitModal>
    );
};
