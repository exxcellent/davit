import React, { FunctionComponent } from "react";
import "./OptionField.css";

export interface OptionFieldProps {
  label: string;
}

export const OptionField: FunctionComponent<OptionFieldProps> = (props) => {
  const { label, children } = props;

  return (
    <div>
      <div className="optionField">{children}</div>
      <div style={{ textAlign: "center", color: "white" }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
};
