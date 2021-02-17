import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent, useEffect, useState } from "react";
import { DavitButton } from "../../../../../../common/fragments/buttons/DavitButton";
import { Carv2Checkbox } from "../../../../../../common/fragments/Carv2Checkbox";

interface Carv2SubmitCancelCheckBoxProps {
    onSubmit: () => void;
    onCancel: () => void;
    onChange: () => void;
    toggleLabel?: string;
    submitCondition?: boolean;
    checked?: boolean;
}

interface Carv2SubmitCancelProps {
    onSubmit: () => void;
    onCancel: () => void;
    submitCondition?: boolean;
}

export const Carv2SubmitCancelCheckBox: FunctionComponent<Carv2SubmitCancelCheckBoxProps> = (props) => {
    const { onCancel, onChange, onSubmit, submitCondition, toggleLabel, checked } = props;

    const [disable, setDisable] = useState<boolean>(false);
    const [label, setToggleLabel] = useState<string>("Create another");

    useEffect(() => {
        if (submitCondition === undefined) {
            setDisable(false);
        } else {
            setDisable(!submitCondition);
        }
        if (toggleLabel !== undefined) {
            setToggleLabel(toggleLabel);
        }
    }, [submitCondition, toggleLabel]);

    return (
        <div className="controllPanelEditChild">
            <DavitButton iconName={faCheck} onClick={onSubmit} disable={disable} />
            <DavitButton iconName={faTimes} onClick={onCancel} />
            <Carv2Checkbox label={label} onChange={onChange} checked={checked} />
        </div>
    );
};

export const Carv2SubmitCancel: FunctionComponent<Carv2SubmitCancelProps> = (props) => {
    const { onCancel, onSubmit, submitCondition } = props;

    const [disable, setDisable] = useState<boolean>(false);

    useEffect(() => {
        if (submitCondition === undefined) {
            setDisable(false);
        } else {
            setDisable(!submitCondition);
        }
    }, [submitCondition]);

    return (
        <div className="controllPanelEditChild">
            <DavitButton iconName={faCheck} onClick={onSubmit} disable={disable} />
            <DavitButton iconName={faTimes} onClick={onCancel} />
        </div>
    );
};
