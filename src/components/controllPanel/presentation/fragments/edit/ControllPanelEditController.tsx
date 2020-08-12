import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { DataRelationTO } from "../../../../../dataAccess/access/to/DataRelationTO";
import { DataSetupTO } from "../../../../../dataAccess/access/to/DataSetupTO";
import { GroupTO } from "../../../../../dataAccess/access/to/GroupTO";
import { EditActions, editSelectors, Mode } from "../../../../../slices/EditSlice";
import { sequenceModelSelectors } from "../../../../../slices/SequenceModelSlice";
import { ControllPanelEditAction } from "./fragments/ControllPanelEditAction";
import { ControllPanelEditComponent } from "./fragments/ControllPanelEditComponent";
import { ControllPanelEditCondition } from "./fragments/ControllPanelEditCondition";
import { ControllPanelEditData } from "./fragments/ControllPanelEditData";
import { ControllPanelEditDataInstance } from "./fragments/ControllPanelEditDataInstance";
import { ControllPanelEditDataSetup } from "./fragments/ControllPanelEditDataSetup";
import { ControllPanelEditGroup } from "./fragments/ControllPanelEditGroup";
import { ControllPanelEditInitData } from "./fragments/ControllPanelEditInitData";
import { ControllPanelEditMenu } from "./fragments/ControllPanelEditMenu";
import { ControllPanelEditRelation } from "./fragments/ControllPanelEditRelation";
import { ControllPanelEditSequence } from "./fragments/ControllPanelEditSequence";
import { ControllPanelEditStep } from "./fragments/ControllPanelEditStep";

export interface ControllPanelEditControllerProps {}

export const ControllPanelEditController: FunctionComponent<ControllPanelEditControllerProps> = (props) => {
  const {
    mode,
    editOrAddComponent,
    editOrAddData,
    editOrAddRelation,
    editOrAddSequence,
    editOrAddGroup,
    editOrAddDataSetup,
  } = useControllPanelEditViewModel();

  const getViewByMode = (currentMode: Mode) => {
    switch (currentMode) {
      case Mode.EDIT_COMPONENT:
        return <ControllPanelEditComponent />;
      case Mode.EDIT_GROUP:
        return <ControllPanelEditGroup />;
      case Mode.EDIT_DATA:
        return <ControllPanelEditData />;
      case Mode.EDIT_DATA_INSTANCE:
        return <ControllPanelEditDataInstance />;
      case Mode.EDIT_DATA_RELATION:
        return <ControllPanelEditRelation />;
      case Mode.EDIT_SEQUENCE:
        return <ControllPanelEditSequence />;
      case Mode.EDIT_SEQUENCE_STEP:
        return <ControllPanelEditStep />;
      case Mode.EDIT_SEQUENCE_CONDITION:
        return <ControllPanelEditCondition />;
      case Mode.EDIT_SEQUENCE_STEP_ACTION:
        return <ControllPanelEditAction />;
      case Mode.EDIT_DATA_SETUP:
        return <ControllPanelEditDataSetup />;
      case Mode.EDIT_INIT_DATA:
        return <ControllPanelEditInitData />;
      default:
        return (
          <ControllPanelEditMenu
            editOrAddComponent={editOrAddComponent}
            editOrAddData={editOrAddData}
            editOrAddRelation={editOrAddRelation}
            editOrAddSequence={editOrAddSequence}
            editOrAddGroup={editOrAddGroup}
            editOrAddDataSetup={editOrAddDataSetup}
          />
        );
    }
  };

  return getViewByMode(mode);
};

const useControllPanelEditViewModel = () => {
  const dispatch = useDispatch();
  const mode: Mode = useSelector(editSelectors.mode);
  const currentStep: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

  useEffect(() => {
    if (currentStep && sequence) {
      const stepToEdit: SequenceStepCTO | undefined = sequence.sequenceStepCTOs.find(
        (step) => step.squenceStepTO.id === currentStep
      );
      if (stepToEdit) {
        dispatch(EditActions.setMode.editStep(stepToEdit));
      }
    }
  });

  return {
    mode,
    editOrAddComponent: (component?: ComponentCTO) => dispatch(EditActions.setMode.editComponent(component)),
    editOrAddData: (data?: DataCTO) => dispatch(EditActions.setMode.editData(data)),
    editOrAddRelation: (relation?: DataRelationTO) => dispatch(EditActions.setMode.editRelation(relation)),
    editOrAddSequence: (sequenceId?: number) => dispatch(EditActions.setMode.editSequence(sequenceId)),
    editOrAddGroup: (group?: GroupTO) => dispatch(EditActions.setMode.editGroup(group)),
    editOrAddDataSetup: (dataSetup?: DataSetupTO) =>
      dispatch(EditActions.setMode.editDataSetup(dataSetup ? dataSetup.id : undefined)),
  };
};
