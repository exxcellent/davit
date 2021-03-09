import React, { FunctionComponent } from 'react';
import { DavitModal } from '../../../../../../common/fragments/modals/DavitModal';
import { DecisionForm } from '../forms/DecisionForm';

interface EditDecicionModalProps {

}

export const EditDecisionModal: FunctionComponent<EditDecicionModalProps> = () => {

    return (
        <DavitModal>
            <DecisionForm />
        </DavitModal>
    );
};
