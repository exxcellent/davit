import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { editSelectors, Mode } from '../../../../../slices/EditSlice';
import { ControlPanelEditChain } from './fragments/ControlPanelEditChain';
import { ControlPanelEditChainCondition } from './fragments/ControlPanelEditChainCondition';
import { ControlPanelEditChainDecision } from './fragments/ControlPanelEditChainDecision';
import { ControlPanelEditChainLink } from './fragments/ControlPanelEditChainLink';
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
            case Mode.EDIT_RELATION:
                return <EditDataRelationModal />;
            case Mode.EDIT_SEQUENCE:
                return <ControlPanelEditSequence hidden={mode !== Mode.EDIT_SEQUENCE} />;
            case Mode.EDIT_SEQUENCE_STEP:
                return <EditStepModal />;
            case Mode.EDIT_SEQUENCE_DECISION:
                return <EditDecisionModal />;
            case Mode.EDIT_SEQUENCE_STEP_ACTION:
                return <EditActionModal />;
            case Mode.EDIT_DATASETUP:
                return <EditDataSetupModal />;
            case Mode.EDIT_DATASETUP_INITDATA:
                return <ControlPanelEditInitData hidden={mode !== Mode.EDIT_DATASETUP_INITDATA} />;
            case Mode.EDIT_CHAIN:
                return <ControlPanelEditChain />;
            case Mode.EDIT_CHAIN_LINK:
                return <ControlPanelEditChainLink hidden={mode !== Mode.EDIT_CHAIN_LINK} />;
            case Mode.EDIT_CHAIN_DECISION:
                return <ControlPanelEditChainDecision />;
            case Mode.EDIT_CHAIN_DECISION_CONDITION:
                return <ControlPanelEditChainCondition />;
            default:
                return <ControlPanelEditMenu />;
        }
    };

    return getViewByMode(mode);
};
