import React, { FunctionComponent } from 'react';
import { DataSetupForm } from '../forms/DataSetupForm';
import { DavitDraggableModal } from '../../../../../../common/fragments/modals/DavitDraggableModal';

interface EditDataSetupModalProps {

}

export const EditDataSetupModal: FunctionComponent<EditDataSetupModalProps> = () => {

    return (
        <DavitDraggableModal form={<DataSetupForm />}/>
    );
};
