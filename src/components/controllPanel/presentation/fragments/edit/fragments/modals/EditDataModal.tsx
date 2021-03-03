import React, { FunctionComponent } from 'react';
import { DavitModal } from '../../../../../../common/fragments/modals/DavitModal';
import { DataForm } from '../forms/DataForm';

interface EditDataModalProps {

}

export const EditDataModal: FunctionComponent<EditDataModalProps> = () => {

    return (
        <DavitModal
            content={
                <DataForm />
            }
        />
    );
};
