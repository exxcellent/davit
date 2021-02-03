import React, { FunctionComponent } from "react";
import { ControllPanelEditSub } from "../edit/common/ControllPanelEditSub";
import { ControllPanelViewOptions } from "./fragments/ControllPanelViewOptions";

export interface ControllPanelTabControllerProps {
    hidden: boolean;
}

export const ControllPanelTabController: FunctionComponent<ControllPanelTabControllerProps> = (props) => {
    const { hidden } = props;
    return (
        <ControllPanelEditSub label="Windows" hidden={hidden}>
            <div className="optionFieldSpacer">
                <ControllPanelViewOptions />
            </div>
            <div className="columnDivider controllPanelEditChild"></div>
            <div className="columnDivider controllPanelEditChild"></div>
            <div className="columnDivider controllPanelEditChild"></div>
        </ControllPanelEditSub>
    );
};
