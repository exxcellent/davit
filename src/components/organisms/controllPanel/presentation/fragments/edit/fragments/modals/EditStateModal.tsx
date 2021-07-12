import React, { FunctionComponent } from "react";
import { DavitModal } from "../../../../../../../atomic";
import { SequenceStateForm } from "../forms/SequenceStateForm";

interface EditStateModalProps {
}

export const EditStateModal: FunctionComponent<EditStateModalProps> = () => {

    return (
        <DavitModal>
            <SequenceStateForm />
        </DavitModal>
    );
};
