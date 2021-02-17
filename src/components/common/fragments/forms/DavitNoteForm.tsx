import React, { FunctionComponent, useEffect, useRef, useState } from "react";

interface DavitNoteFormProps {
    subHeader?: string;
    text?: string;
    onSubmit: (nodeText: string) => void;
    onCancel: () => void;
}

export const DavitNoteForm: FunctionComponent<DavitNoteFormProps> = (props) => {
    const { subHeader, onCancel, onSubmit, text } = props;
    const textAreRef = useRef<HTMLTextAreaElement>(null);
    const [noteText, setNoteText] = useState<string>("");

    useEffect(() => {
        setNoteText(text ? text : "");
        textAreRef.current!.focus();
    }, [text]);

    /**
     * Close the form on ESC push.
     */
    useEffect(() => {
        const escButtonCall = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onCancel();
            }
        };

        document.addEventListener("keydown", escButtonCall, false);

        return () => {
            document.removeEventListener("keydown", escButtonCall, false);
        };
    }, [onCancel]);

    /**
     * Close and Submit on Enter
     */
    useEffect(() => {
        const returnButtonCall = (event: KeyboardEvent) => {
            console.info(event.key);
            if (event.key === "Enter") {
                onSubmit(noteText);
            }
        };

        document.addEventListener("keydown", returnButtonCall, false);

        return () => {
            document.removeEventListener("keydown", returnButtonCall, false);
        };
    }, [noteText, onSubmit]);

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
            <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "var(--davit-padding)" }}>
                <button onClick={() => onCancel()}>cancel</button>
                <button onClick={() => onSubmit(noteText)}>save</button>
            </div>
        </div>
    );
};
