import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../../common/fragments/modals/DavitDraggableModal";
import { DataRelationForm } from "../forms/DataRelationForm";

interface EditDataRelationModalProps {

}

export const EditDataRelationModal: FunctionComponent<EditDataRelationModalProps> = () => {

    return (
        <DavitDraggableModal form={<DataRelationForm />} />
    );
};
