import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataConnectionTO } from "../../../dataAccess/access/to/DataConnectionTO";
import { Mode, selectMode } from "../../common/viewModel/GlobalSlice";
import {
  selectComponentToEdit,
  selectDataToEdit,
} from "../viewModel/ControllPanelSlice";
import { ControllPanelEdit } from "./fragments/edit/ControllPanelEdit";
import { ControllPanelEditComponent } from "./fragments/edit/ControllPanelEditComponent";
import { ControllPanelEditData } from "./fragments/edit/ControllPanelEditData";
import { ControllPanelEditRelation } from "./fragments/edit/ControllPanelEditRelation";
import { ControllPanelSequenceOptions } from "./fragments/view/ControllPanelSequenceOptions";

export interface ControllPanelProps {}

export const ControllPanelController: FunctionComponent<ControllPanelProps> = (
  props
) => {
  const mode: Mode = useSelector(selectMode);
  const componentToEdit: ComponentCTO | null = useSelector(
    selectComponentToEdit
  );

  const dataToEdit: DataCTO | null = useSelector(selectDataToEdit);

  console.log("rendering " + mode);

  const useGetViewByMode = (mode: Mode) => {
    switch (mode) {
      case Mode.VIEW:
        return <ControllPanelSequenceOptions />;
      case Mode.EDIT:
        return <ControllPanelEdit />;
      case Mode.EDIT_COMPONENT:
        if (componentToEdit) {
          return <ControllPanelEditComponent component={componentToEdit} />;
        }
        break;
      case Mode.EDIT_DATA:
        if (dataToEdit) {
          return <ControllPanelEditData data={dataToEdit} />;
        }
        break;
      case Mode.EDIT_DATA_RELATION:
        return (
          <ControllPanelEditRelation dataConnection={new DataConnectionTO()} />
        );
      case Mode.EDIT_SEQUENCE:
        // TODO: muss noch implementiert werden!
        return null;
    }
  };

  return <div className="controllerHeader">{useGetViewByMode(mode)}</div>;
};
