import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { ChainTO } from "../../../../../dataAccess/access/to/ChainTO";
import { DataRelationTO } from "../../../../../dataAccess/access/to/DataRelationTO";
import { DataSetupTO } from "../../../../../dataAccess/access/to/DataSetupTO";
import { GroupTO } from "../../../../../dataAccess/access/to/GroupTO";
import { EditActions, editSelectors, Mode } from "../../../../../slices/EditSlice";
import { ControllPanelEditAction } from "./fragments/ControllPanelEditAction";
import { ControllPanelEditChain } from "./fragments/ControllPanelEditChain";
import { ControllPanelEditComponent } from "./fragments/ControllPanelEditComponent";
import { ControllPanelEditCondition } from "./fragments/ControllPanelEditCondition";
import { ControllPanelEditData } from "./fragments/ControllPanelEditData";
import { ControllPanelEditDataInstance } from "./fragments/ControllPanelEditDataInstance";
import { ControllPanelEditDataSetup } from "./fragments/ControllPanelEditDataSetup";
import { ControllPanelEditDecision } from "./fragments/ControllPanelEditDecision";
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
    editOrAddChain,
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
      case Mode.EDIT_SEQUENCE_DECISION:
        return <ControllPanelEditDecision />;
      case Mode.EDIT_SEQUENCE_DECISION_CONDITION:
        return <ControllPanelEditCondition />;
      case Mode.EDIT_SEQUENCE_STEP_ACTION:
        return <ControllPanelEditAction />;
      case Mode.EDIT_DATA_SETUP:
        return <ControllPanelEditDataSetup />;
      case Mode.EDIT_INIT_DATA:
        return <ControllPanelEditInitData />;
      case Mode.EDIT_CHAIN:
        return <ControllPanelEditChain />;
      default:
        return (
          <ControllPanelEditMenu
            editOrAddComponent={editOrAddComponent}
            editOrAddData={editOrAddData}
            editOrAddRelation={editOrAddRelation}
            editOrAddSequence={editOrAddSequence}
            editOrAddGroup={editOrAddGroup}
            editOrAddDataSetup={editOrAddDataSetup}
            editOrAddChain={editOrAddChain}
          />
        );
    }
  };

  return getViewByMode(mode);
};

const useControllPanelEditViewModel = () => {
  const dispatch = useDispatch();
  const mode: Mode = useSelector(editSelectors.mode);

  return {
    mode,
    editOrAddComponent: (component?: ComponentCTO) => dispatch(EditActions.setMode.editComponent(component)),
    editOrAddData: (data?: DataCTO) => dispatch(EditActions.setMode.editData(data)),
    editOrAddRelation: (relation?: DataRelationTO) => dispatch(EditActions.setMode.editRelation(relation)),
    editOrAddSequence: (sequenceId?: number) => dispatch(EditActions.setMode.editSequence(sequenceId)),
    editOrAddGroup: (group?: GroupTO) => dispatch(EditActions.setMode.editGroup(group)),
    editOrAddDataSetup: (dataSetup?: DataSetupTO) =>
      dispatch(EditActions.setMode.editDataSetup(dataSetup ? dataSetup.id : undefined)),
    editOrAddChain: (chain?: ChainTO) => dispatch(EditActions.setMode.editChain(chain)),
  };
};
