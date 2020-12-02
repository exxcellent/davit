/* eslint-disable react/display-name */
import React from 'react';
import { Input, InputProps } from 'semantic-ui-react';

interface DavitLabelTextfieldProps extends InputProps {
    label: string;
    placeholder: string;
    value: string;
    unvisible: boolean;
}

export const DavitLabelTextfield = React.forwardRef<Input, DavitLabelTextfieldProps>((props, ref) => {
    const { label, onChangeCallBack, placeholder, value, unvisible, ...other } = props;
    return (
        <Input
            className={unvisible ? 'slideable-hidden' : 'slideable'}
            label={label}
            placeholder={placeholder}
            value={value}
            inverted
            color="orange"
            ref={ref}
            {...other}
        />
    );
});
