import React, { FunctionComponent } from "react";
import { Mode } from "../../common/viewModel/GlobalSlice";
import { useControllPanelViewModel } from "../viewModel/ControllPanelViewModel";
import { ControllPanelEdit } from "./fragments/edit/ControllPanelEdit";
import { ControllPanelEditComponent } from "./fragments/edit/ControllPanelEditComponent";
import { ControllPanelEditComponentData } from "./fragments/edit/ControllPanelEditComponentData";
import { ControllPanelEditData } from "./fragments/edit/ControllPanelEditData";
import { ControllPanelEditRelation } from "./fragments/edit/ControllPanelEditRelation";
import { ControllPanelEditSequence } from "./fragments/edit/ControllPanelEditSequence";
import { ControllPanelEditStep } from "./fragments/edit/ControllPanelEditStep";
import { ControllPanelSequenceOptions } from "./fragments/view/ControllPanelSequenceOptions";

export interface ControllPanelProps {}

export const ControllPanelController: FunctionComponent<ControllPanelProps> = (props) => {
  const { component, data, relation, sequence, mode, step } = useControllPanelViewModel();

  const useGetViewByMode = (mode: Mode) => {
    switch (mode) {
      case Mode.VIEW:
        return <ControllPanelSequenceOptions />;
      case Mode.EDIT:
        return <ControllPanelEdit />;
      case Mode.EDIT_COMPONENT:
        if (component) {
          return <ControllPanelEditComponent component={component} />;
        } else {
          return <ControllPanelEdit />;
        }
      case Mode.EDIT_DATA:
        if (data) {
          return <ControllPanelEditData data={data} />;
        } else {
          return <ControllPanelEdit />;
        }
      case Mode.EDIT_DATA_RELATION:
        if (relation) {
          return <ControllPanelEditRelation dataRelation={relation} />;
        } else {
          return <ControllPanelEdit />;
        }
      case Mode.EDIT_SEQUENCE:
        if (sequence) {
          return <ControllPanelEditSequence sequence={sequence} />;
        } else {
          return <ControllPanelEdit />;
        }
      case Mode.EDIT_SEQUENCE_STEP:
        if (step) {
          return <ControllPanelEditStep sequenceStep={step} />;
        } else {
          return <ControllPanelEdit />;
        }

      case Mode.EDIT_SEQUENCE_STEP_COMPONENT_DATA:
        return <ControllPanelEditComponentData component={component} />;
    }
  };

  return <div className="controllerHeader">{useGetViewByMode(mode)}</div>;
};
