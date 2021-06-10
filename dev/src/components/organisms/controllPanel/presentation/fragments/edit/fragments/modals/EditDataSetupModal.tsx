import React, { FunctionComponent } from "react";
import { DavitDraggableModal } from "../../../../../../../atomic";
import { DataSetupForm } from "../forms/DataSetupForm";

interface EditDataSetupModalProps {

}

export const EditDataSetupModal: FunctionComponent<EditDataSetupModalProps> = () => {

    return (
        <DavitDraggableModal form={<DataSetupForm />} />
    );
};
