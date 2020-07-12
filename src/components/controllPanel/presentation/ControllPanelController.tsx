import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { editSelectors, Mode } from "../../../slices/EditSlice";
import { ControllPanelEditController } from "./fragments/edit/ControllPanelEditController";
import { ControllPanelFileController } from "./fragments/file/ControllPanelFileController";
import { ControllPanelSequenceOptions } from "./fragments/view/ControllPanelSequenceOptions";

export interface ControllPanelProps {}

export const ControllPanelController: FunctionComponent<ControllPanelProps> = (props) => {
  const { mode } = useControllPanelViewModel();

  const useGetViewByMode = (mode: Mode) => {
    if (!isNullOrUndefined(mode)) {
      if (mode.includes("EDIT")) {
        return <ControllPanelEditController />;
      }
      if (mode.includes("VIEW")) {
        return <ControllPanelSequenceOptions />;
      }
      if (mode.includes("FILE")) {
        return <ControllPanelFileController />;
      }
    }
  };

  return <div className="controllerHeader">{useGetViewByMode(mode)}</div>;
};

interface ControllPanelViewModel {
  mode: Mode;
}

const useControllPanelViewModel = (): ControllPanelViewModel => {
  const mode: Mode = useSelector(editSelectors.mode);
  return { mode };
};
