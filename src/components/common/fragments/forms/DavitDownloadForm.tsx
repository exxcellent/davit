import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { GlobalActions } from "../../../../slices/GlobalSlice";
import { DavitLabelTextfield } from "../DavitLabelTextfield";

interface DavitDownloadFormProps {
    onCloseCallback: () => void;
}

export const DavitDownloadForm: FunctionComponent<DavitDownloadFormProps> = (props) => {
    const { onCloseCallback } = props;

    const dispatch = useDispatch();

    const [projectName, setProjectName] = useState<string>("");

    const onSubmit = () => {
        dispatch(GlobalActions.downloadData(projectName !== "" ? projectName : "project"));
        onCloseCallback();
    };

    return (
        <div className="noteCard">
            <DavitLabelTextfield
                label="Export file name:"
                placeholder="project name..."
                onChangeDebounced={(name: string) => setProjectName(name)}
                value={projectName}
                autoFocus
                invisible={false}
            />
            <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "var(--davit-padding)" }}>
                <button onClick={() => onCloseCallback()}>cancel</button>
                <button onClick={() => onSubmit()}>export</button>
            </div>
        </div>
    );
};
