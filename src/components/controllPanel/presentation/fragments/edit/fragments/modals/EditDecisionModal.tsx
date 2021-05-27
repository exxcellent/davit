import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../common/fragments/modals/DavitDraggableModal";
import { DecisionForm } from "../forms/DecisionForm";

interface EditDecicionModalProps {

}

export const EditDecisionModal: FunctionComponent<EditDecicionModalProps> = () => {

    return (
        <DavitDraggableModal form={<DecisionForm />} />
    );
};
