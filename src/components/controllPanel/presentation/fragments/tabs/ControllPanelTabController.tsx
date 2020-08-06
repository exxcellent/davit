import React, { FunctionComponent } from "react";
import { ControllPanelEditSub } from "../edit/common/ControllPanelEditSub";
import { ControllPanelViewOptions } from "./fragments/ControllPanelViewOptions";

export interface ControllPanelTabControllerProps {}

export const ControllPanelTabController: FunctionComponent<ControllPanelTabControllerProps> = (props) => {
  return (
    <ControllPanelEditSub label="TABS">
      <div className="optionFieldSpacer">
        <ControllPanelViewOptions />
      </div>
      <div className="columnDivider controllPanelEditChild"></div>
      <div className="columnDivider controllPanelEditChild"></div>
      <div className="columnDivider controllPanelEditChild"></div>
    </ControllPanelEditSub>
  );
};
