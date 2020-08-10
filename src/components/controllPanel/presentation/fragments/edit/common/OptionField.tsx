import React, { FunctionComponent } from "react";

export interface OptionFieldProps {
  label?: string;
}

export const OptionField: FunctionComponent<OptionFieldProps> = (props) => {
  const { label, children } = props;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "space-around",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="optionField">{children}</div>
      {label && <div className="optionFieldLabel">{label.toUpperCase()}</div>}
    </div>
  );
};
