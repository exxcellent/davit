import React, {FunctionComponent} from "react";
import {ControlPanelEditSub} from "../edit/common/ControlPanelEditSub";
import {ControllPanelViewOptions} from "./fragments/ControllPanelViewOptions";

export interface ControlPanelTabControllerProps {
    hidden: boolean;
}

export const ControlPanelTabController: FunctionComponent<ControlPanelTabControllerProps> = (props) => {
    const {hidden} = props;
    return (
        <ControlPanelEditSub label="Windows" hidden={hidden}>
            <div className="optionFieldSpacer">
                <ControllPanelViewOptions/>
            </div>
            <div className="columnDivider controllPanelEditChild"/>
            <div className="columnDivider controllPanelEditChild"/>
            <div className="columnDivider controllPanelEditChild"/>
        </ControlPanelEditSub>
    );
};
