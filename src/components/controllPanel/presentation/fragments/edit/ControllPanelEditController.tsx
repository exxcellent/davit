import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { ComponentActions } from "../../../../../slices/ComponentSlice";
import { DataActions } from "../../../../../slices/DataSlice";
import { GlobalActions, Mode, selectMode } from "../../../../../slices/GlobalSlice";
import { SequenceActions } from "../../../../../slices/SequenceSlice";
import { ControllPanelEditComponent } from "./fragments/ControllPanelEditComponent";
import { ControllPanelEditData } from "./fragments/ControllPanelEditData";
import { ControllPanelEditMenu } from "./fragments/ControllPanelEditMenu";
import { ControllPanelEditRelation } from "./fragments/ControllPanelEditRelation";
import { ControllPanelEditSequence } from "./fragments/ControllPanelEditSequence";

export interface ControllPanelEditControllerProps {}

export const ControllPanelEditController: FunctionComponent<ControllPanelEditControllerProps> = (props) => {
  const {
    mode,
    editOrAddComponent,
    editOrAddData,
    editOrAddRelation,
    editOrAddSequence,
  } = useControllPanelEditViewModel();

  const getViewByMode = (currentMode: Mode) => {
    switch (currentMode) {
      case Mode.EDIT_COMPONENT:
        return <ControllPanelEditComponent />;
      case Mode.EDIT_DATA:
        return <ControllPanelEditData />;
      case Mode.EDIT_DATA_RELATION:
        return <ControllPanelEditRelation />;
      case Mode.EDIT_SEQUENCE:
        return <ControllPanelEditSequence />;
      // case Mode.EDIT_SEQUENCE_STEP:
      //   return <ControllPanelEditStep sequenceStep={step} />;
      // case Mode.EDIT_SEQUENCE_STEP_COMPONENT_DATA:
      //   return <ControllPanelEditComponentData component={component} />;
      default:
        return (
          <ControllPanelEditMenu
            editOrAddComponent={editOrAddComponent}
            editOrAddData={editOrAddData}
            editOrAddRelation={editOrAddRelation}
            editOrAddSequence={editOrAddSequence}
          />
        );
    }
  };

  return getViewByMode(mode);
};

const useControllPanelEditViewModel = () => {
  const dispatch = useDispatch();
  const mode: Mode = useSelector(selectMode);

  useEffect(() => {
    dispatch(SequenceActions.loadSequencesFromBackend());
    dispatch(ComponentActions.loadComponentsFromBackend());
    dispatch(DataActions.loadDatasFromBackend());
    dispatch(DataActions.loadRelationsFromBackend());
  });

  return {
    mode,
    editOrAddComponent: (component?: ComponentCTO) => dispatch(GlobalActions.setModeToEditComponent(component)),
    editOrAddData: (data?: DataCTO) => dispatch(GlobalActions.setModeToEditData(data)),
    editOrAddRelation: (relation?: DataRelationCTO) => dispatch(GlobalActions.setModeToEditRelation(relation)),
    editOrAddSequence: (sequence?: SequenceCTO) => dispatch(GlobalActions.setModeToEditSequence(sequence)),
  };
};
