import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import {
  Mode,
  selectGlobalModeState,
} from "../../common/viewModel/GlobalSlice";
import { ControllPanelMetaComponentOptions } from "./fragments/ControllPanelMetaComponentOptions";
import { ControllPanelSequenceOptions } from "./fragments/ControllPanelSequenceOptions";

export interface ControllPanelProps {}

export const ControllPanelController: FunctionComponent<ControllPanelProps> = (
  props
) => {
  const mode: Mode = useSelector(selectGlobalModeState);

  return (
    <div>
      {mode === Mode.VIEW && <ControllPanelSequenceOptions />}
      {mode === Mode.EDIT && <ControllPanelMetaComponentOptions />}
    </div>
  );
};
