import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { Mode, selectMode } from "../../common/viewModel/GlobalSlice";
import {
  selectComponentToEdit,
  selectDataRelationToEdit,
  selectDataToEdit,
  selectSequenceStepToEdit,
  selectSequenceToEdit,
} from "../viewModel/ControllPanelSlice";
import { ControllPanelEdit } from "./fragments/edit/ControllPanelEdit";
import { ControllPanelEditComponent } from "./fragments/edit/ControllPanelEditComponent";
import { ControllPanelEditComponentData } from "./fragments/edit/ControllPanelEditComponentData";
import { ControllPanelEditData } from "./fragments/edit/ControllPanelEditData";
import { ControllPanelEditRelation } from "./fragments/edit/ControllPanelEditRelation";
import { ControllPanelEditSequence } from "./fragments/edit/ControllPanelEditSequence";
import { ControllPanelEditStep } from "./fragments/edit/ControllPanelEditStep";
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

  const dataRelationToEdit: DataRelationCTO | null = useSelector(
    selectDataRelationToEdit
  );

  const sequenceToEdit: SequenceCTO | null = useSelector(selectSequenceToEdit);
  const sequenceStepToEdit: SequenceStepCTO | null = useSelector(
    selectSequenceStepToEdit
  );

  const useGetViewByMode = (mode: Mode) => {
    switch (mode) {
      case Mode.VIEW:
        return <ControllPanelSequenceOptions />;
      case Mode.EDIT:
        return <ControllPanelEdit />;
      case Mode.EDIT_COMPONENT:
        if (componentToEdit) {
          return <ControllPanelEditComponent component={componentToEdit} />;
        } else {
          return <ControllPanelEdit />;
        }
      case Mode.EDIT_DATA:
        if (dataToEdit) {
          return <ControllPanelEditData data={dataToEdit} />;
        } else {
          return <ControllPanelEdit />;
        }
      case Mode.EDIT_DATA_RELATION:
        if (dataRelationToEdit) {
          return (
            <ControllPanelEditRelation dataRelation={dataRelationToEdit} />
          );
        } else {
          return <ControllPanelEdit />;
        }
      case Mode.EDIT_SEQUENCE:
        if (sequenceToEdit) {
          return <ControllPanelEditSequence sequence={sequenceToEdit} />;
        } else {
          return <ControllPanelEdit />;
        }
      case Mode.EDIT_SEQUENCE_STEP:
        if (sequenceStepToEdit) {
          return <ControllPanelEditStep sequenceStep={sequenceStepToEdit} />;
        } else {
          return <ControllPanelEdit />;
        }

      case Mode.EDIT_SEQUENCE_STEP_COMPONENT_DATA:
        return <ControllPanelEditComponentData component={componentToEdit} />;
    }
  };

  return <div className="controllerHeader">{useGetViewByMode(mode)}</div>;
};
