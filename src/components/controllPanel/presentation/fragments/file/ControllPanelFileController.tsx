import React, { FunctionComponent } from "react";
import { ControllPanelFileOptions } from "./fragments/ControllPanelFileOptions";

export interface ControllPanelFileControllerProps {}

export const ControllPanelFileController: FunctionComponent<ControllPanelFileControllerProps> = (props) => {
  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <ControllPanelFileOptions />
      </div>
    </div>
  );
};
