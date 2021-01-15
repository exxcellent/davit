import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SequenceCTO } from '../../../../../../dataAccess/access/cto/SequenceCTO';
import { ConditionTO } from '../../../../../../dataAccess/access/to/ConditionTO';
import { EditActions, editSelectors } from '../../../../../../slices/EditSlice';
import { handleError } from '../../../../../../slices/GlobalSlice';
import { sequenceModelSelectors } from '../../../../../../slices/SequenceModelSlice';
import { EditCondition } from '../../../../../../slices/thunks/ConditionThunks';
import { EditDecision } from '../../../../../../slices/thunks/DecisionThunks';
import { DavitUtil } from '../../../../../../utils/DavitUtil';
import { DavitButtonIcon } from '../../../../../common/fragments/buttons/DavitButton';
import { DavitDeleteButton } from '../../../../../common/fragments/buttons/DavitDeleteButton';
import { DavitMenuLabel } from '../../../../../common/fragments/DavitMenuLabel';
import { ActorDropDown } from '../../../../../common/fragments/dropdowns/ActorDropDown';
import { DataAndInstanceId, InstanceDropDown } from '../../../../../common/fragments/dropdowns/InstanceDropDown';
import { ControllPanelEditSub } from '../common/ControllPanelEditSub';
import { OptionField } from '../common/OptionField';

export interface ControllPanelEditConditionProps {
    hidden: boolean;
}

export const ControllPanelEditCondition: FunctionComponent<ControllPanelEditConditionProps> = (props) => {
    const { hidden } = props;
    const {
        label,
        setMode,
        actorFk,
        setActorFk,
        setData,
        selectedInstance,
        deleteCondition,
    } = useControllPanelEditConditionViewModel();

    return (
        <ControllPanelEditSub label={label} hidden={hidden} onClickNavItem={setMode}>
            <div className="optionFieldSpacer">
                <OptionField label="Select Actor">
                    <ActorDropDown
                        value={actorFk?.toString()}
                        onSelect={(actor) => setActorFk(actor?.actor.id || -1)}
                    />
                </OptionField>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <DavitMenuLabel text="HAS" />
            </div>
            <div className="columnDivider optionFieldSpacer">
                <OptionField label="Select data for actor">
                    <InstanceDropDown
                        onSelect={(data) => {
                            setData(data);
                        }}
                        selected={selectedInstance}
                    />
                </OptionField>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <OptionField label="Navigation">
                    <DavitDeleteButton onClick={deleteCondition} />
                    <DavitButtonIcon onClick={setMode} icon="reply" />
                </OptionField>
            </div>
        </ControllPanelEditSub>
    );
};

const useControllPanelEditConditionViewModel = () => {
    const conditionToEdit: ConditionTO | null = useSelector(editSelectors.selectConditionToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useDispatch();

    useEffect(() => {
        if (DavitUtil.isNullOrUndefined(conditionToEdit)) {
            dispatch(handleError('Tried to go to edit condition without conditoin to edit specified'));
            dispatch(EditActions.setMode.edit());
        }
    }, [conditionToEdit, dispatch]);

    const setData = (dataAndInstanceIds: DataAndInstanceId | undefined) => {
        if (!DavitUtil.isNullOrUndefined(conditionToEdit)) {
            const copyConditionToEdit: ConditionTO = DavitUtil.deepCopy(conditionToEdit);
            copyConditionToEdit.dataFk = dataAndInstanceIds?.dataFk || -1;
            copyConditionToEdit.instanceFk = dataAndInstanceIds?.instanceId || -1;
            dispatch(EditCondition.save(copyConditionToEdit));
            dispatch(EditCondition.update(copyConditionToEdit));
        }
    };

    const setMode = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(conditionToEdit)) {
            if (newMode && newMode === 'EDIT') {
                dispatch(EditActions.setMode.edit());
            } else if (newMode && newMode === 'SEQUENCE') {
                dispatch(EditActions.setMode.editSequence(selectedSequence?.sequenceTO.id));
            } else {
                // TODO: testen ob dass passt!!!
                dispatch(
                    EditActions.setMode.editDecision(
                        selectedSequence?.decisions.find((decision) => decision.id === conditionToEdit?.decisionFk)!,
                    ),
                );
            }
        } else {
            console.info('decisionToEdit is null!');
        }
    };

    const setActorFk = (actorId: number) => {
        if (!DavitUtil.isNullOrUndefined(conditionToEdit)) {
            const copyConditionToEdit: ConditionTO = DavitUtil.deepCopy(conditionToEdit);
            copyConditionToEdit.actorFk = actorId;
            dispatch(EditCondition.save(copyConditionToEdit));
            dispatch(EditCondition.update(copyConditionToEdit));
        }
    };

    const deleteCondition = () => {
        if (!DavitUtil.isNullOrUndefined(conditionToEdit)) {
            const copyCondition: ConditionTO = DavitUtil.deepCopy(conditionToEdit);
            dispatch(EditCondition.delete(copyCondition));
            dispatch(EditActions.setMode.editDecision(EditDecision.find(conditionToEdit!.decisionFk)));
        }
    };

    return {
        label:
            'EDIT * ' +
            (selectedSequence?.sequenceTO.name || '') +
            ' * ' +
            (selectedSequence?.decisions.find((decision) => decision.id === conditionToEdit?.decisionFk)?.name || '') +
            ' * CONDITION',
        setMode,
        actorFk: conditionToEdit?.actorFk,
        setActorFk,
        setData,
        selectedInstance: conditionToEdit?.instanceFk,
        deleteCondition,
    };
};
