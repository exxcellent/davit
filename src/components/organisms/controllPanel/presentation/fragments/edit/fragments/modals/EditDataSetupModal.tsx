import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../../common/fragments/modals/DavitDraggableModal";
import { DataSetupForm } from "../forms/DataSetupForm";

interface EditDataSetupModalProps {

}

export const EditDataSetupModal: FunctionComponent<EditDataSetupModalProps> = () => {

    return (
        <DavitDraggableModal form={<DataSetupForm />} />
    );
};
