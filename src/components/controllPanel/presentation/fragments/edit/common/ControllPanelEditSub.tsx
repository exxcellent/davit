import React, { FunctionComponent } from "react";

interface ControllPanelEditProps {
  label: string;
}

export const ControllPanelEditSub: FunctionComponent<ControllPanelEditProps> = (props) => {
  const { label, children } = props;

  return (
    <div className="optionFieldSpacer" style={{ height: "100%", justifyContent: "space-around" }}>
      <div />
      <div style={{ textAlign: "center", color: "white" }}>{label.toUpperCase()}</div>
      <div className="controllPanelEdit">{children}</div>
      <div />
    </div>
  );
};
