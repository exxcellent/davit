import React, { FunctionComponent } from 'react';
import { DavitModal } from '../../../../../../common/fragments/modals/DavitModal';
import { StepForm } from '../forms/StepForm';

interface EditStepModalProps {

}

export const EditStepModal: FunctionComponent<EditStepModalProps> = () => {

    return (
        <DavitModal>
            <StepForm />
        </DavitModal>
    );
};
