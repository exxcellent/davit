import React, { FunctionComponent } from 'react';
import { DavitDraggableModal } from '../../../../../../common/fragments/modals/DavitDraggableModal';
import { ChainLinkForm } from '../forms/ChainLinkForm';

interface EditChainLinkModalProps {

}

export const EditChainLinkModal: FunctionComponent<EditChainLinkModalProps> = () => {

    return (
        <DavitDraggableModal form={<ChainLinkForm />} />
    );
};
