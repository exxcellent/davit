import React, {FunctionComponent, useState} from "react";
import {DavitButton} from "./DavitButton";
import {faComment, faCommentDots} from "@fortawesome/free-solid-svg-icons";
import {DavitModal} from "../DavitModal";
import {DavitNoteForm} from "../forms/DavitNoteForm";

interface DavitCommentButtonProps {
    onSaveCallback: (comment: string) => void;
    comment: string;
}

export const DavitCommentButton: FunctionComponent<DavitCommentButtonProps> = (props) => {
    const {onSaveCallback, comment} = props;

    const [showForm, setShowForm] = useState<boolean>(false);

    return (
        <>
            <DavitButton onClick={() => setShowForm(true)} iconName={comment === "" ? faComment : faCommentDots}/>
            {showForm && (
                <DavitModal
                    content={
                        <DavitNoteForm
                            text={comment}
                            onSubmit={(text: string) => {
                                setShowForm(false);
                                onSaveCallback(text);
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    }
                />
            )}
        </>
    );
};
