import React, { FunctionComponent } from "react";
import { ControllPanelViewOptions } from "./fragments/ControllPanelViewOptions";

export interface ControllPanelTabControllerProps {}

export const ControllPanelTabController: FunctionComponent<ControllPanelTabControllerProps> = (props) => {
  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <ControllPanelViewOptions />
      </div>
    </div>
  );
};
