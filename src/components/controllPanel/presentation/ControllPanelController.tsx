import React, { FunctionComponent, useEffect } from "react";
import { useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { Mode, selectMode } from "../../common/viewModel/GlobalSlice";
import { ControllPanelEdit } from "./fragments/edit/ControllPanelEdit";
import { ControllPanelEditComponent } from "./fragments/edit/ControllPanelEditComponent";
import { ControllPanelEditData } from "./fragments/edit/ControllPanelEditData";
import { ControllPanelSequenceOptions } from "./fragments/view/ControllPanelSequenceOptions";

export interface ControllPanelProps {}

export const ControllPanelController: FunctionComponent<ControllPanelProps> = (
  props
) => {
  const mode: Mode = useSelector(selectMode);

  useEffect(() => {
    getViewByMode(mode);
  }, [mode]);

  const getViewByMode = (mode: Mode) => {
    switch (mode) {
      case Mode.VIEW:
        return <ControllPanelSequenceOptions />;
      case Mode.EDIT:
        return <ControllPanelEdit />;
      case Mode.EDIT_COMPONENT:
        return <ControllPanelEditComponent component={new ComponentCTO()} />;
      case Mode.EDIT_DATA:
        return <ControllPanelEditData data={new DataCTO()} />;
      case Mode.EDIT_SEQUENCE:
        // TODO: muss noch implementiert werden!
        return null;
    }
  };

  return <div className="controllerHeader">{getViewByMode(mode)}</div>;
};
