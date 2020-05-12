import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import {
  Mode,
  selectGlobalModeState,
} from "../../common/viewModel/GlobalSlice";
import { ControllPanelEdit } from "./fragments/edit/ControllPanelEdit";
import { ControllPanelSequenceOptions } from "./fragments/view/ControllPanelSequenceOptions";

export interface ControllPanelProps {}

export const ControllPanelController: FunctionComponent<ControllPanelProps> = (
  props
) => {
  const mode: Mode = useSelector(selectGlobalModeState);

  return (
    <div className="controllerHeader">
      {mode === Mode.VIEW && <ControllPanelSequenceOptions />}
      {mode === Mode.EDIT && <ControllPanelEdit />}
    </div>
  );
};
