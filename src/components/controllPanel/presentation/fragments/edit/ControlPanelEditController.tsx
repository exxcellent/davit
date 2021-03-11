import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { editSelectors, Mode } from '../../../../../slices/EditSlice';
import { ControlPanelEditChain } from './fragments/ControlPanelEditChain';
import { ControllPanelEditChainCondition } from './fragments/ControllPanelEditChainCondition';
import { ControlPanelEditChainDecision } from './fragments/ControlPanelEditChainDecision';
import { ControlPanelEditChainLink } from './fragments/ControlPanelEditChainLink';
import { ControlPanelEditCondition } from './fragments/ControlPanelEditCondition';
import { ControlPanelEditDataInstance } from './fragments/ControlPanelEditDataInstance';
import { ControlPanelEditGroup } from './fragments/ControlPanelEditGroup';
import { ControlPanelEditInitData } from './fragments/ControlPanelEditInitData';
import { ControlPanelEditMenu } from './fragments/ControlPanelEditMenu';
import { ControlPanelEditSequence } from './fragments/ControlPanelEditSequence';
import { EditActorModal } from './fragments/modals/EditActorModal';
import { EditDataModal } from './fragments/modals/EditDataModal';
import { EditDataRelationModal } from './fragments/modals/EditDataRelationModal';
import { EditDataSetupModal } from './fragments/modals/EditDataSetupModal';
import { EditActionModal } from './fragments/modals/EditActionModal';
import { EditDecisionModal } from './fragments/modals/EditDecisionModal';
import { EditStepModal } from './fragments/modals/EditStepModal';

export interface ControlPanelEditControllerProps {
}

export const ControlPanelEditController: FunctionComponent<ControlPanelEditControllerProps> = () => {

    const mode: Mode = useSelector(editSelectors.selectMode);

    const getViewByMode = (currentMode: Mode) => {
        switch (currentMode) {
            case Mode.EDIT_ACTOR:
                return <EditActorModal />;
            case Mode.EDIT_GROUP:
                return <ControlPanelEditGroup hidden={mode !== Mode.EDIT_GROUP} />;
            case Mode.EDIT_DATA:
                return <EditDataModal />;
            case Mode.EDIT_DATA_INSTANCE:
                return <ControlPanelEditDataInstance hidden={mode !== Mode.EDIT_DATA_INSTANCE} />;
            case Mode.EDIT_RELATION:
                return <EditDataRelationModal />;
            case Mode.EDIT_SEQUENCE:
                return <ControlPanelEditSequence hidden={mode !== Mode.EDIT_SEQUENCE} />;
            case Mode.EDIT_SEQUENCE_STEP:
                return <EditStepModal />;
            case Mode.EDIT_SEQUENCE_DECISION:
                return <EditDecisionModal />;
            case Mode.EDIT_SEQUENCE_DECISION_CONDITION:
                return <ControlPanelEditCondition hidden={mode !== Mode.EDIT_SEQUENCE_DECISION_CONDITION} />;
            case Mode.EDIT_SEQUENCE_STEP_ACTION:
                return <EditActionModal />;
            case Mode.EDIT_DATASETUP:
                return <EditDataSetupModal />;
            case Mode.EDIT_DATASETUP_INITDATA:
                return <ControlPanelEditInitData hidden={mode !== Mode.EDIT_DATASETUP_INITDATA} />;
            case Mode.EDIT_CHAIN:
                return <ControlPanelEditChain hidden={mode !== Mode.EDIT_CHAIN} />;
            case Mode.EDIT_CHAIN_LINK:
                return <ControlPanelEditChainLink hidden={mode !== Mode.EDIT_CHAIN_LINK} />;
            case Mode.EDIT_CHAIN_DECISION:
                return <ControlPanelEditChainDecision hidden={mode !== Mode.EDIT_CHAIN_DECISION} />;
            case Mode.EDIT_CHAIN_DECISION_CONDITION:
                return <ControllPanelEditChainCondition hidden={mode !== Mode.EDIT_CHAIN_DECISION_CONDITION} />;
            default:
                return <ControlPanelEditMenu />;
        }
    };

    return getViewByMode(mode);
};
