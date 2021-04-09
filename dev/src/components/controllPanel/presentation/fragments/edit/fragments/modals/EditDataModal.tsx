import React, { FunctionComponent } from 'react';
import { DataForm } from '../forms/DataForm';
import { DavitDraggableModal } from '../../../../../../common/fragments/modals/DavitDraggableModal';

interface EditDataModalProps {

}

export const EditDataModal: FunctionComponent<EditDataModalProps> = () => {

    return (
        <DavitDraggableModal form={<DataForm />}/>
    );
};
