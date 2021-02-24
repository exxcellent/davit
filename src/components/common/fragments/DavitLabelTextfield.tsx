/* eslint-disable react/display-name */
import debounce from "lodash.debounce";
import React, {FunctionComponent, Ref, useCallback, useEffect, useState} from "react";

export interface DavitLabelTextfieldProps {
    onChangeDebounced: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    value?: string;
    label?: string;
    ref?: Ref<HTMLInputElement>
}

export const DavitLabelTextfield: FunctionComponent<DavitLabelTextfieldProps> = (props) => {
    const {label, placeholder, value, onChangeDebounced, ref, onBlur} = props;

    const [stateValue, setStateValue] = useState<string>("");

    useEffect(() => {
        setStateValue(value ? value : "");
    }, [value]);

    const inputDebounce = useCallback(debounce(onChangeDebounced, 30), []);

    return (
        <span>
                <label className={"inputLabel"}>{label}</label>
                <input
                    className={label ? "input label" : ""}
                    type={"text"}
                    placeholder={placeholder}
                    value={stateValue}
                    ref={ref}
                    onChange={(event) => {
                        setStateValue(event.target.value);
                        inputDebounce(event.target.value);
                    }}
                    onBlur={onBlur}
                />
            </span>
    );
};
