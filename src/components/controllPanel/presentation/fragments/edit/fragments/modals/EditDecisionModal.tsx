import React, { FunctionComponent } from 'react';
import { DecisionForm } from '../forms/DecisionForm';
import { DavitDraggableModal } from '../../../../../../common/fragments/modals/DavitDraggableModal';

interface EditDecicionModalProps {

}

export const EditDecisionModal: FunctionComponent<EditDecicionModalProps> = () => {

    return (
        <DavitDraggableModal form={<DecisionForm />} />
    );
};
