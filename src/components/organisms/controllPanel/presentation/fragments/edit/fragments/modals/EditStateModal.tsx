import React, { FunctionComponent } from "react";
import { DavitModal } from "../../../../../../../atomic";
import { StateForm } from "../forms/StateForm";

interface EditStateModalProps {

}

export const EditStateModal: FunctionComponent<EditStateModalProps> = () => {

    return (
        <DavitModal>
            <StateForm />
        </DavitModal>
    );
};
