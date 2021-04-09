import React, { FunctionComponent } from 'react';
import { ActorForm } from '../forms/ActorForm';
import { DavitDraggableModal } from '../../../../../../common/fragments/modals/DavitDraggableModal';

interface EditActorModalProps {

}

export const EditActorModal: FunctionComponent<EditActorModalProps> = () => {

    return (
        <DavitDraggableModal form={<ActorForm />} />
    );
};
