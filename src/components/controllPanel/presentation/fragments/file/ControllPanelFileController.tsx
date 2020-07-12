import React, { FunctionComponent } from "react";
import { ControllPanelFileOptions } from "./fragments/ControllPanelFileOptions";
import { ControllPanelViewOptions } from "./fragments/ControllPanelViewOptions";

export interface ControllPanelFileControllerProps { }

export const ControllPanelFileController: FunctionComponent<ControllPanelFileControllerProps> = (props) => {
  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <ControllPanelFileOptions />
      </div>
      <div className="optionFieldSpacer">
        <ControllPanelViewOptions />
      </div>
    </div>
  );
};
