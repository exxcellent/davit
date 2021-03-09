import React, { FunctionComponent } from 'react';
import { DavitModal } from '../../../../../../common/fragments/modals/DavitModal';
import { DataSetupForm } from '../forms/DataSetupForm';

interface EditDataSetupModalProps {

}

export const EditDataSetupModal: FunctionComponent<EditDataSetupModalProps> = () => {

    return (
        <DavitModal>
            <DataSetupForm />
        </DavitModal>
    );
};
