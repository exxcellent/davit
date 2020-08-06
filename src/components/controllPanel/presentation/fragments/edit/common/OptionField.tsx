import React, { FunctionComponent } from "react";

export interface OptionFieldProps {
  label1?: string;
  label2?: string;
}

export const OptionField: FunctionComponent<OptionFieldProps> = (props) => {
  const { label1, label2, children } = props;

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
      {label1 && label2 === undefined && <div className="optionFieldLabel">{label1.toUpperCase()}</div>}
      {label1 && label2 && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div className="optionFieldLabel">{label1.toUpperCase()}</div>
          <div className="optionFieldLabel">{label2.toUpperCase()}</div>
        </div>
      )}
    </div>
  );
};
