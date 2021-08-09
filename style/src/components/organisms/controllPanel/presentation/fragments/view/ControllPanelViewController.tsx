import React, { FunctionComponent } from "react";
import { Mode } from "../../../../../../slices/EditSlice";
import { ControlPanelConfiguration } from "./fragments/ControlPanelConfiguration";
import { ControlPanelView } from "./fragments/ControlPanelView";

export interface ControlPanelViewControllerProps {
    mode: Mode;
}

export const ControlPanelViewController: FunctionComponent<ControlPanelViewControllerProps> = (props) => {

    const {mode} = props;

    const getViewByMode = (mode: Mode) => {
        switch (mode) {
            case Mode.VIEW_CONFIGURATION:
                return <ControlPanelConfiguration />;
            case Mode.VIEW:
                return <ControlPanelView />;
            default:
                return <ControlPanelConfiguration />;
        }
    };

    return (getViewByMode(mode));
};
