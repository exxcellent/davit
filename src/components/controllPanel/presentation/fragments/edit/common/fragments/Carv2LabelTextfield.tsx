/* eslint-disable react/display-name */
import React from "react";
import { Input, InputProps } from "semantic-ui-react";

interface Carv2LabelTextfieldProps extends InputProps {
  label: string;
  placeholder: string;
  value: string;
}

export const Carv2LabelTextfield = React.forwardRef<
  Input,
  Carv2LabelTextfieldProps
>((props, ref) => {
  const { label, onChangeCallBack, placeholder, value, ...other } = props;
  return (
    <div className="controllPanelEditChild" style={{ height: "100%" }}>
      <Input
        label={label}
        placeholder={placeholder}
        value={value}
        inverted
        color="orange"
        ref={ref}
        {...other}
      />
    </div>
  );
});
