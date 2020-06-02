import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { Mode, selectMode } from "../../../slices/GlobalSlice";
import { ControllPanelEditController } from "./fragments/edit/ControllPanelEditController";
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
    }
  };

  return <div className="controllerHeader">{useGetViewByMode(mode)}</div>;
};

interface ControllPanelViewModel {
  mode: Mode;
}

const useControllPanelViewModel = (): ControllPanelViewModel => {
  const mode: Mode = useSelector(selectMode);
  return { mode };
};
