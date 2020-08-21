import React, { FunctionComponent } from "react";

interface ControllPanelEditProps {
  label: string;
}

export const ControllPanelEditSub: FunctionComponent<ControllPanelEditProps> = (props) => {
  const { label, children } = props;

  return (
    <div className="optionFieldSpacer" style={{ height: "100%", justifyContent: "space-around", width: '100%', padding: '10px' }}>
      <div />
      <div style={{ textAlign: "center", color: "white" }}>{label.toUpperCase()}</div>
      <div className="controllPanelEdit">{children}</div>
      <div />
    </div>
  );
};
