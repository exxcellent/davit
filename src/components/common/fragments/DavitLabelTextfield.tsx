/* eslint-disable react/display-name */
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { Input, InputProps } from "semantic-ui-react";

interface DavitLabelTextfieldProps extends InputProps {
    placeholder: string;
    value: string;
    invisible: boolean;
    onChangeDebounced: (value: string) => void;
    label?: string;
}

export const DavitLabelTextfield = React.forwardRef<Input, DavitLabelTextfieldProps>((props, ref) => {
    const { label, onChangeCallBack, placeholder, value, invisible, onChangeDebounced, ...other } = props;

    const [stateValue, setStateValue] = useState<string>("");

    useEffect(() => {
        setStateValue(value);
    }, [value]);

    const inputDebounce = useCallback(debounce(onChangeDebounced, 30), []);

    // TODO: remove semantic Input
    return (
        <Input
            className={invisible ? "slideable-hidden" : "slideable"}
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
