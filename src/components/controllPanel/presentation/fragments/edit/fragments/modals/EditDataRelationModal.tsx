import React, { FunctionComponent } from 'react';
import { DataRelationForm } from '../forms/DataRelationForm';
import { DavitDraggableModal } from '../../../../../../common/fragments/modals/DavitDraggableModal';

interface EditDataRelationModalProps {

}

export const EditDataRelationModal: FunctionComponent<EditDataRelationModalProps> = () => {

    return (
        <DavitDraggableModal form={<DataRelationForm />}/>
    );
};
