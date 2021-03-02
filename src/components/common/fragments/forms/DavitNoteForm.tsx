import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import {useEnterHook, useEscHook} from "../../../../utils/WindowUtil";

interface DavitNoteFormProps {
    subHeader?: string;
    text?: string;
    onSubmit: (nodeText: string) => void;
    onCancel: () => void;
}

export const DavitNoteForm: FunctionComponent<DavitNoteFormProps> = (props) => {
    const {subHeader, onCancel, onSubmit, text} = props;
    const textAreRef = useRef<HTMLTextAreaElement>(null);
    const [noteText, setNoteText] = useState<string>("");

    useEffect(() => {
        setNoteText(text ? text : "");
        textAreRef.current!.focus();
    }, [text]);

    // Close the form on ESC push.
    useEscHook(onCancel);

    // Close and Submit on Enter
    useEnterHook(() => onSubmit(noteText));

    return (
        <div className="noteCard">
            <h1>Note</h1>
            {subHeader && <h2>{subHeader}</h2>}
            <textarea
                className={"noteTextarea"}
                onChange={(e) => setNoteText(e.target.value)}
                value={noteText}
                ref={textAreRef}
            />
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                paddingTop: "var(--davit-padding-top-bottom)"
            }}>
                <button onClick={() => onCancel()}>cancel</button>
                <button onClick={() => onSubmit(noteText)}>save</button>
            </div>
        </div>
    );
};
