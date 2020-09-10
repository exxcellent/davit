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
import { ControllPanelEditChainCondition } from "./fragments/ControllPanelEditChainCondition";
import { ControllPanelEditChainDecision } from "./fragments/ControllPanelEditChainDecision";
import { ControllPanelEditChainLink } from "./fragments/ControllPanelEditChainLink";
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
        return <ControllPanelEditComponent hidden={mode !== Mode.EDIT_COMPONENT} />;
      case Mode.EDIT_GROUP:
        return <ControllPanelEditGroup hidden={mode !== Mode.EDIT_GROUP} />;
      case Mode.EDIT_DATA:
        return <ControllPanelEditData hidden={mode !== Mode.EDIT_DATA} />;
      case Mode.EDIT_DATA_INSTANCE:
        return <ControllPanelEditDataInstance hidden={mode !== Mode.EDIT_DATA_INSTANCE} />;
      case Mode.EDIT_RELATION:
        return <ControllPanelEditRelation hidden={mode !== Mode.EDIT_RELATION} />;
      case Mode.EDIT_SEQUENCE:
        return <ControllPanelEditSequence hidden={mode !== Mode.EDIT_SEQUENCE} />;
      case Mode.EDIT_SEQUENCE_STEP:
        return <ControllPanelEditStep hidden={mode !== Mode.EDIT_SEQUENCE_STEP} />;
      case Mode.EDIT_SEQUENCE_DECISION:
        return <ControllPanelEditDecision hidden={mode !== Mode.EDIT_SEQUENCE_DECISION} />;
      case Mode.EDIT_SEQUENCE_DECISION_CONDITION:
        return <ControllPanelEditCondition hidden={mode !== Mode.EDIT_SEQUENCE_DECISION_CONDITION} />;
      case Mode.EDIT_SEQUENCE_STEP_ACTION:
        return <ControllPanelEditAction hidden={mode !== Mode.EDIT_SEQUENCE_STEP_ACTION} />;
      case Mode.EDIT_DATASETUP:
        return <ControllPanelEditDataSetup hidden={mode !== Mode.EDIT_DATASETUP} />;
      case Mode.EDIT_DATASETUP_INITDATA:
        return <ControllPanelEditInitData hidden={mode !== Mode.EDIT_DATASETUP_INITDATA} />;
      case Mode.EDIT_CHAIN:
        return <ControllPanelEditChain hidden={mode !== Mode.EDIT_CHAIN} />;
      case Mode.EDIT_CHAIN_LINK:
        return <ControllPanelEditChainLink hidden={mode !== Mode.EDIT_CHAIN_LINK} />;
      case Mode.EDIT_CHAIN_DECISION:
        return <ControllPanelEditChainDecision hidden={mode !== Mode.EDIT_CHAIN_DECISION} />;
      case Mode.EDIT_CHAIN_DECISION_CONDITION:
        return <ControllPanelEditChainCondition hidden={mode !== Mode.EDIT_CHAIN_DECISION_CONDITION} />;
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
            hidden={mode !== Mode.EDIT}
          />
        );
    }
  };

  return getViewByMode(mode);
  // <div style={{ display: 'flex', width: '100%' }}>
  /*{ <ControllPanelEditMenu
    editOrAddComponent={editOrAddComponent}
    editOrAddData={editOrAddData}
    editOrAddRelation={editOrAddRelation}
    editOrAddSequence={editOrAddSequence}
    editOrAddGroup={editOrAddGroup}
    editOrAddDataSetup={editOrAddDataSetup}
    editOrAddChain={editOrAddChain}
    hidden={mode !== Mode.EDIT}
  />
  <ControllPanelEditComponent hidden={mode !== Mode.EDIT_COMPONENT} />
  <ControllPanelEditGroup hidden={mode !== Mode.EDIT_GROUP} />
  <ControllPanelEditData hidden={mode !== Mode.EDIT_DATA} />
  <ControllPanelEditSequence hidden={mode !== Mode.EDIT_SEQUENCE} />
  <ControllPanelEditRelation hidden={mode !== Mode.EDIT_RELATION} />
  <ControllPanelEditChain hidden={mode !== Mode.EDIT_CHAIN} />
  <ControllPanelEditDataInstance hidden={mode !== Mode.EDIT_DATA_INSTANCE} />
  <ControllPanelEditStep hidden={mode !== Mode.EDIT_SEQUENCE_STEP} />
  <ControllPanelEditDecision hidden={mode !== Mode.EDIT_SEQUENCE_DECISION} />
  <ControllPanelEditAction hidden={mode !== Mode.EDIT_SEQUENCE_STEP_ACTION} />
  <ControllPanelEditCondition hidden={mode !== Mode.EDIT_SEQUENCE_DECISION_CONDITION} />
  <ControllPanelEditDataSetup hidden={mode !== Mode.EDIT_DATASETUP} />
  <ControllPanelEditInitData hidden={mode !== Mode.EDIT_DATASETUP_INITDATA} />
  <ControllPanelEditChainLink hidden={mode !== Mode.EDIT_CHAIN_LINK} />
  <ControllPanelEditChainDecision hidden={mode !== Mode.EDIT_CHAIN_DECISION} />
</div> }*/
  // );
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
