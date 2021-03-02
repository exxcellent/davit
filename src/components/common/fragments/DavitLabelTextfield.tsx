/* eslint-disable react/display-name */
import debounce from "lodash.debounce";
import React, {FunctionComponent, Ref, useCallback, useEffect, useRef, useState} from "react";

export interface DavitLabelTextfieldProps {
    onChangeDebounced: (value: string) => void;
    focus?: boolean;
    onBlur?: () => void;
    placeholder?: string;
    value?: string;
    label?: string;
}

export const DavitLabelTextfield: FunctionComponent<DavitLabelTextfieldProps> = (props) => {
    const {label, placeholder, value, onChangeDebounced, onBlur, focus} = props;

    const [stateValue, setStateValue] = useState<string>("");

    useEffect(() => {
        setStateValue(value ? value : "");
    }, [value]);

    const inputRef: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

    // focus on input field on render.
    useEffect(() => {
        if (inputRef !== null && inputRef.current !== null && focus) {
            inputRef.current.focus();
        }
    }, [focus, inputRef]);

    const inputDebounce = useCallback(debounce(onChangeDebounced, 30), []);

    return (
        <div style={{display: "flex"}}>
            {label && <label className={"inputLabel"}>{label}</label>}
            <input
                className={label ? "input label" : ""}
                type={"text"}
                placeholder={placeholder}
                value={stateValue}
                ref={inputRef}
                onChange={(event) => {
                    setStateValue(event.target.value);
                    inputDebounce(event.target.value);
                }}
                onBlur={onBlur}
            />
        </div>
    );
};
