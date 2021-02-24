import React, {FunctionComponent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ActorCTO} from "../../../../../dataAccess/access/cto/ActorCTO";
import {DataCTO} from "../../../../../dataAccess/access/cto/DataCTO";
import {ChainTO} from "../../../../../dataAccess/access/to/ChainTO";
import {DataRelationTO} from "../../../../../dataAccess/access/to/DataRelationTO";
import {DataSetupTO} from "../../../../../dataAccess/access/to/DataSetupTO";
import {GroupTO} from "../../../../../dataAccess/access/to/GroupTO";
import {EditActions, editSelectors, Mode} from "../../../../../slices/EditSlice";
import {ControllPanelEditAction} from "./fragments/ControllPanelEditAction";
import {ControlPanelEditActor} from "./fragments/ControlPanelEditActor";
import {ControlPanelEditChain} from "./fragments/ControlPanelEditChain";
import {ControllPanelEditChainCondition} from "./fragments/ControllPanelEditChainCondition";
import {ControlPanelEditChainDecision} from "./fragments/ControlPanelEditChainDecision";
import {ControlPanelEditChainLink} from "./fragments/ControlPanelEditChainLink";
import {ControllPanelEditCondition} from "./fragments/ControllPanelEditCondition";
import {ControllPanelEditData} from "./fragments/ControllPanelEditData";
import {ControlPanelEditDataInstance} from "./fragments/ControlPanelEditDataInstance";
import {ControlPanelEditDataSetup} from "./fragments/ControlPanelEditDataSetup";
import {ControlPanelEditDecision} from "./fragments/ControlPanelEditDecision";
import {ControlPanelEditGroup} from "./fragments/ControlPanelEditGroup";
import {ControllPanelEditInitData} from "./fragments/ControllPanelEditInitData";
import {ControlPanelEditMenu} from "./fragments/ControlPanelEditMenu";
import {ControllPanelEditRelation} from "./fragments/ControllPanelEditRelation";
import {ControlPanelEditSequence} from "./fragments/ControlPanelEditSequence";
import {ControlPanelEditStep} from "./fragments/ControlPanelEditStep";

export interface ControlPanelEditControllerProps {
}

export const ControlPanelEditController: FunctionComponent<ControlPanelEditControllerProps> = () => {

    const {
        mode,
        editOrAddActor,
        editOrAddData,
        editOrAddRelation,
        editOrAddSequence,
        editOrAddGroup,
        editOrAddDataSetup,
        editOrAddChain,
    } = useControllPanelEditViewModel();

    const getViewByMode = (currentMode: Mode) => {
        switch (currentMode) {
            case Mode.EDIT_ACTOR:
                return <ControlPanelEditActor hidden={mode !== Mode.EDIT_ACTOR}/>;
            case Mode.EDIT_GROUP:
                return <ControlPanelEditGroup hidden={mode !== Mode.EDIT_GROUP}/>;
            case Mode.EDIT_DATA:
                return <ControllPanelEditData hidden={mode !== Mode.EDIT_DATA}/>;
            case Mode.EDIT_DATA_INSTANCE:
                return <ControlPanelEditDataInstance hidden={mode !== Mode.EDIT_DATA_INSTANCE}/>;
            case Mode.EDIT_RELATION:
                return <ControllPanelEditRelation hidden={mode !== Mode.EDIT_RELATION}/>;
            case Mode.EDIT_SEQUENCE:
                return <ControlPanelEditSequence hidden={mode !== Mode.EDIT_SEQUENCE}/>;
            case Mode.EDIT_SEQUENCE_STEP:
                return <ControlPanelEditStep hidden={mode !== Mode.EDIT_SEQUENCE_STEP}/>;
            case Mode.EDIT_SEQUENCE_DECISION:
                return <ControlPanelEditDecision hidden={mode !== Mode.EDIT_SEQUENCE_DECISION}/>;
            case Mode.EDIT_SEQUENCE_DECISION_CONDITION:
                return <ControllPanelEditCondition hidden={mode !== Mode.EDIT_SEQUENCE_DECISION_CONDITION}/>;
            case Mode.EDIT_SEQUENCE_STEP_ACTION:
                return <ControllPanelEditAction hidden={mode !== Mode.EDIT_SEQUENCE_STEP_ACTION}/>;
            case Mode.EDIT_DATASETUP:
                return <ControlPanelEditDataSetup hidden={mode !== Mode.EDIT_DATASETUP}/>;
            case Mode.EDIT_DATASETUP_INITDATA:
                return <ControllPanelEditInitData hidden={mode !== Mode.EDIT_DATASETUP_INITDATA}/>;
            case Mode.EDIT_CHAIN:
                return <ControlPanelEditChain hidden={mode !== Mode.EDIT_CHAIN}/>;
            case Mode.EDIT_CHAIN_LINK:
                return <ControlPanelEditChainLink hidden={mode !== Mode.EDIT_CHAIN_LINK}/>;
            case Mode.EDIT_CHAIN_DECISION:
                return <ControlPanelEditChainDecision hidden={mode !== Mode.EDIT_CHAIN_DECISION}/>;
            case Mode.EDIT_CHAIN_DECISION_CONDITION:
                return <ControllPanelEditChainCondition hidden={mode !== Mode.EDIT_CHAIN_DECISION_CONDITION}/>;
            default:
                return (
                    <ControlPanelEditMenu
                        editOrAddActor={editOrAddActor}
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
    /* { <ControllPanelEditMenu
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
    const mode: Mode = useSelector(editSelectors.selectMode);

    return {
        mode,
        editOrAddActor: (actor?: ActorCTO) => dispatch(EditActions.setMode.editActor(actor)),
        editOrAddData: (data?: DataCTO) => dispatch(EditActions.setMode.editData(data)),
        editOrAddRelation: (relation?: DataRelationTO) => dispatch(EditActions.setMode.editRelation(relation)),
        editOrAddSequence: (sequenceId?: number) => dispatch(EditActions.setMode.editSequence(sequenceId)),
        editOrAddGroup: (group?: GroupTO) => dispatch(EditActions.setMode.editGroup(group)),
        editOrAddDataSetup: (dataSetup?: DataSetupTO) =>
            dispatch(EditActions.setMode.editDataSetup(dataSetup ? dataSetup.id : undefined)),
        editOrAddChain: (chain?: ChainTO) => dispatch(EditActions.setMode.editChain(chain)),
    };
};
