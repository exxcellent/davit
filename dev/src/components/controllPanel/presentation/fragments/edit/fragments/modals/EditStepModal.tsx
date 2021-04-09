import React, { FunctionComponent } from 'react';
import { StepForm } from '../forms/StepForm';
import { DavitDraggableModal } from '../../../../../../common/fragments/modals/DavitDraggableModal';

interface EditStepModalProps {

}

export const EditStepModal: FunctionComponent<EditStepModalProps> = () => {

    return (
        <DavitDraggableModal form={<StepForm />}/>
    );
};
