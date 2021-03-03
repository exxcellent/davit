import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { editSelectors, Mode } from '../../../../../slices/EditSlice';
import { ControlPanelEditAction } from './fragments/ControlPanelEditAction';
import { ControlPanelEditChain } from './fragments/ControlPanelEditChain';
import { ControllPanelEditChainCondition } from './fragments/ControllPanelEditChainCondition';
import { ControlPanelEditChainDecision } from './fragments/ControlPanelEditChainDecision';
import { ControlPanelEditChainLink } from './fragments/ControlPanelEditChainLink';
import { ControlPanelEditCondition } from './fragments/ControlPanelEditCondition';
import { ControlPanelEditData } from './fragments/ControlPanelEditData';
import { ControlPanelEditDataInstance } from './fragments/ControlPanelEditDataInstance';
import { ControlPanelEditDataSetup } from './fragments/ControlPanelEditDataSetup';
import { ControlPanelEditDecision } from './fragments/ControlPanelEditDecision';
import { ControlPanelEditGroup } from './fragments/ControlPanelEditGroup';
import { ControlPanelEditInitData } from './fragments/ControlPanelEditInitData';
import { ControlPanelEditMenu } from './fragments/ControlPanelEditMenu';
import { ControlPanelEditRelation } from './fragments/ControlPanelEditRelation';
import { ControlPanelEditSequence } from './fragments/ControlPanelEditSequence';
import { ControlPanelEditStep } from './fragments/ControlPanelEditStep';
import { EditActorModal } from './fragments/modals/EditActorModal';

export interface ControlPanelEditControllerProps {
}

export const ControlPanelEditController: FunctionComponent<ControlPanelEditControllerProps> = () => {

    const mode: Mode = useSelector(editSelectors.selectMode);

    const getViewByMode = (currentMode: Mode) => {
        switch (currentMode) {
            case Mode.EDIT_ACTOR:
                return <EditActorModal />;
            case Mode.EDIT_GROUP:
                return <ControlPanelEditGroup hidden={mode !== Mode.EDIT_GROUP}/>;
            case Mode.EDIT_DATA:
                return <ControlPanelEditData hidden={mode !== Mode.EDIT_DATA}/>;
            case Mode.EDIT_DATA_INSTANCE:
                return <ControlPanelEditDataInstance hidden={mode !== Mode.EDIT_DATA_INSTANCE}/>;
            case Mode.EDIT_RELATION:
                return <ControlPanelEditRelation hidden={mode !== Mode.EDIT_RELATION}/>;
            case Mode.EDIT_SEQUENCE:
                return <ControlPanelEditSequence hidden={mode !== Mode.EDIT_SEQUENCE}/>;
            case Mode.EDIT_SEQUENCE_STEP:
                return <ControlPanelEditStep hidden={mode !== Mode.EDIT_SEQUENCE_STEP}/>;
            case Mode.EDIT_SEQUENCE_DECISION:
                return <ControlPanelEditDecision hidden={mode !== Mode.EDIT_SEQUENCE_DECISION}/>;
            case Mode.EDIT_SEQUENCE_DECISION_CONDITION:
                return <ControlPanelEditCondition hidden={mode !== Mode.EDIT_SEQUENCE_DECISION_CONDITION}/>;
            case Mode.EDIT_SEQUENCE_STEP_ACTION:
                return <ControlPanelEditAction hidden={mode !== Mode.EDIT_SEQUENCE_STEP_ACTION}/>;
            case Mode.EDIT_DATASETUP:
                return <ControlPanelEditDataSetup hidden={mode !== Mode.EDIT_DATASETUP}/>;
            case Mode.EDIT_DATASETUP_INITDATA:
                return <ControlPanelEditInitData hidden={mode !== Mode.EDIT_DATASETUP_INITDATA}/>;
            case Mode.EDIT_CHAIN:
                return <ControlPanelEditChain hidden={mode !== Mode.EDIT_CHAIN}/>;
            case Mode.EDIT_CHAIN_LINK:
                return <ControlPanelEditChainLink hidden={mode !== Mode.EDIT_CHAIN_LINK}/>;
            case Mode.EDIT_CHAIN_DECISION:
                return <ControlPanelEditChainDecision hidden={mode !== Mode.EDIT_CHAIN_DECISION}/>;
            case Mode.EDIT_CHAIN_DECISION_CONDITION:
                return <ControllPanelEditChainCondition hidden={mode !== Mode.EDIT_CHAIN_DECISION_CONDITION}/>;
            default:
                return <ControlPanelEditMenu/>;
        }
    };

    return getViewByMode(mode);
};
