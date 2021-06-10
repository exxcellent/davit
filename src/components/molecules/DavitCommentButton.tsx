import { faComment, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent, useState } from "react";
import { DavitIconButton } from "../atomic/buttons";
import { DavitNoteModal } from "../atomic/modals/DavitNoteModal";

export interface DavitCommentButtonProps {
    onSaveCallback: (comment: string) => void;
    comment: string;
}

export const DavitCommentButton: FunctionComponent<DavitCommentButtonProps> = (props) => {
    const {onSaveCallback, comment} = props;

    const [showForm, setShowForm] = useState<boolean>(false);

    return (
        <>
            <DavitIconButton onClick={() => setShowForm(true)}
                             iconName={comment === "" ? faComment : faCommentDots}
            />
            {showForm &&
            <DavitNoteModal text={comment}
                            closeCallback={() => setShowForm(false)}
                            saveTextCallback={onSaveCallback}
            />
            }
        </>
    );
};
