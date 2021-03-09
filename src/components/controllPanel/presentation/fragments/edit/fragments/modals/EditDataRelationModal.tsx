import React, { FunctionComponent } from 'react';
import { DavitModal } from '../../../../../../common/fragments/modals/DavitModal';
import { DataRelationForm } from '../forms/DataRelationForm';

interface EditDataRelationModalProps {

}

export const EditDataRelationModal: FunctionComponent<EditDataRelationModalProps> = () => {

    return (
        <DavitModal>
            <DataRelationForm />
        </DavitModal>
    );
};
