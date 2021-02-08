/* eslint-disable react/display-name */
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { Input, InputProps } from "semantic-ui-react";

interface DavitLabelTextfieldProps extends InputProps {
    label: string;
    placeholder: string;
    value: string;
    unvisible: boolean;
    onChangeDebounced: (value: string) => void;
}

export const DavitLabelTextfield = React.forwardRef<Input, DavitLabelTextfieldProps>((props, ref) => {
    const { label, onChangeCallBack, placeholder, value, unvisible, onChangeDebounced, ...other } = props;

    const [stateValue, setStateValue] = useState<string>("");

    useEffect(() => {
        setStateValue(value);
    }, [value]);

    const inputDebounce = useCallback(debounce(onChangeDebounced, 30), []);

    return (
        <Input
            className={unvisible ? "slideable-hidden" : "slideable"}
            label={label}
            placeholder={placeholder}
            value={stateValue}
            inverted
            color="orange"
            ref={ref}
            onChange={(event) => {
                setStateValue(event.target.value);
                inputDebounce(event.target.value);
            }}
            {...other}
        />
    );
});
