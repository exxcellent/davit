import React, { FunctionComponent } from "react";
import "./ControlPanel.css";

interface ControlPanelProps {
}

export const ControlPanel: FunctionComponent<ControlPanelProps> = (props) => {
    const {children} = props;

    return (
        <div className={"headerGrid"}>{children}</div>
    );
};
