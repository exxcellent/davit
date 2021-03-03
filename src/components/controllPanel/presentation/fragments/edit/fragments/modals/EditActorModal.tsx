import React, { FunctionComponent } from 'react';
import { DavitModal } from '../../../../../../common/fragments/modals/DavitModal';
import { ActorForm } from '../forms/ActorForm';

interface EditActorModalProps{

}

export const EditActorModal: FunctionComponent<EditActorModalProps> = () => {

    return (
        <DavitModal
            content={
                <ActorForm />
            }
        />
    );
};



