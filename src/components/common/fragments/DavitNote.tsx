import React, { FunctionComponent, useEffect, useState } from "react";

interface DavitNoteProps {
    subHeader?: string;
    text?: string;
    onSubmit: (nodeText: string) => void;
    onCancel: () => void;
}

export const DavitNote: FunctionComponent<DavitNoteProps> = (props) => {
    const { subHeader, onCancel, onSubmit, text } = props;

    const [noteText, setNoteText] = useState<string>("");

    useEffect(() => {
        setNoteText(text ? text : "");
    }, [text]);

    return (
        <div className="noteCard">
            <h1>Note</h1>
            {subHeader && <h2>{subHeader}</h2>}
            <textarea className={"noteTextarea"} onChange={(e) => setNoteText(e.target.value)}>
                {noteText}
            </textarea>
            <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "var(--davit-padding)" }}>
                <button onClick={() => onCancel()}>CANCEL</button>
                <button onClick={() => onSubmit(noteText)}>SAVE</button>
            </div>
        </div>
    );
};
