import { useDispatch, useSelector } from 'react-redux';
import { ActorCTO } from '../../../../../../../dataAccess/access/cto/ActorCTO';
import { DataCTO } from '../../../../../../../dataAccess/access/cto/DataCTO';
import { SequenceCTO } from '../../../../../../../dataAccess/access/cto/SequenceCTO';
import { SequenceStepCTO } from '../../../../../../../dataAccess/access/cto/SequenceStepCTO';
import { ActionTO } from '../../../../../../../dataAccess/access/to/ActionTO';
import { ActionType } from '../../../../../../../dataAccess/access/types/ActionType';
import { EditActions, editSelectors } from '../../../../../../../slices/EditSlice';
import { MasterDataActions } from '../../../../../../../slices/MasterDataSlice';
import { sequenceModelSelectors } from '../../../../../../../slices/SequenceModelSlice';
import { EditAction } from '../../../../../../../slices/thunks/ActionThunks';
import { DavitUtil } from '../../../../../../../utils/DavitUtil';
import { DataAndInstanceId } from '../../../../../../common/fragments/dropdowns/InstanceDropDown';
import { GlobalActions } from '../../../../../../../slices/GlobalSlice';
import { useState } from 'react';


export const useActionViewModel = () => {
    const actionToEdit: ActionTO | null = useSelector(editSelectors.selectActionToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useDispatch();

    const [key, setKey] = useState<number>(0);

    const deleteAction = (action: ActionTO) => {
        if (action !== null) {
            dispatch(EditAction.delete(action));

            const step: SequenceStepCTO | undefined = MasterDataActions.find.findSequenceStepCTO(
                action.sequenceStepFk,
            );

            if (step) {
                dispatch(EditActions.setMode.editStep(step));
            } else {
                // should never happend but as fallback savty.
                dispatch(GlobalActions.handleError('Step not found!'));
                dispatch(EditActions.setMode.edit());
            }
        }
    };

    const deleteActionToEdit = () => {
        if (!DavitUtil.isNullOrUndefined(actionToEdit)) {
            deleteAction(actionToEdit!);
        }
    };

    const setActor = (actor: ActorCTO | undefined, sending: boolean): void => {
        if (actor !== undefined) {
            const copyActionToEdit: ActionTO = DavitUtil.deepCopy(actionToEdit);
            sending
                ? (copyActionToEdit.sendingActorFk = actor.actor.id)
                : (copyActionToEdit.receivingActorFk = actor.actor.id);
            dispatch(EditAction.update(copyActionToEdit));
            dispatch(EditAction.save(copyActionToEdit));
        }
    };

    const setAction = (newActionType: ActionType | undefined): void => {
        if (newActionType !== undefined && selectedSequence !== null && actionToEdit !== null) {
            const copyActionToEdit: ActionTO = DavitUtil.deepCopy(actionToEdit);
            copyActionToEdit.actionType = newActionType;
            copyActionToEdit.sendingActorFk = newActionType.includes('SEND') ? actionToEdit.sendingActorFk : -1;
            copyActionToEdit.receivingActorFk = newActionType.includes('SEND') ? actionToEdit.receivingActorFk : -1;
            dispatch(EditAction.update(copyActionToEdit));
            dispatch(EditAction.save(copyActionToEdit));
        }
    };

    const setTriggerLabel = (text: string) => {
        if (actionToEdit !== undefined) {
            const copyActionToEdit: ActionTO = DavitUtil.deepCopy(actionToEdit);
            copyActionToEdit.triggerText = text;
            dispatch(EditAction.update(copyActionToEdit));
            // TODO: this can maybe removed, anyway would be better!
            dispatch(EditAction.save(copyActionToEdit));
        }
    };

    const setData = (data: DataCTO | undefined): void => {
        if (data !== undefined) {
            const copyActionToEdit: ActionTO = DavitUtil.deepCopy(actionToEdit);
            copyActionToEdit.dataFk = data.data.id;
            dispatch(EditAction.update(copyActionToEdit));
            dispatch(EditAction.save(copyActionToEdit));
        }
    };

    const setDataAndInstance = (dataAndInstance: DataAndInstanceId | undefined): void => {
        if (dataAndInstance !== undefined) {
            const copyActionToEdit: ActionTO = DavitUtil.deepCopy(actionToEdit);
            copyActionToEdit.dataFk = dataAndInstance.dataFk;
            copyActionToEdit.instanceFk = dataAndInstance.instanceId;
            dispatch(EditAction.update(copyActionToEdit));
            dispatch(EditAction.save(copyActionToEdit));
        }
    };

    const validAction = (action: ActionTO): boolean => {
        let valid: boolean;
        switch (action.actionType) {
            case ActionType.TRIGGER:
                valid = action.receivingActorFk !== -1 && action.sendingActorFk !== -1;
                break;
            case ActionType.SEND:
                valid = action.dataFk !== -1 && action.receivingActorFk !== -1 && action.sendingActorFk !== -1;
                break;
            case ActionType.SEND_AND_DELETE:
                valid = action.dataFk !== -1 && action.receivingActorFk !== -1 && action.sendingActorFk !== -1;
                break;
            default:
                valid = action.dataFk !== -1 && action.receivingActorFk !== -1;
        }
        return valid;
    };

    const setMode = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(actionToEdit)) {
            if (!validAction(actionToEdit!)) {
                deleteAction(actionToEdit!);
            }
            if (newMode && newMode === 'EDIT') {
                dispatch(EditActions.setMode.edit());
            } else if (newMode && newMode === 'SEQUENCE') {
                dispatch(EditActions.setMode.editSequence(selectedSequence?.sequenceTO.id));
            } else {
                const step: SequenceStepCTO | undefined = MasterDataActions.find.findSequenceStepCTO(
                    actionToEdit!.sequenceStepFk,
                );
                if (step) {
                    dispatch(EditActions.setMode.editStep(step));
                }
            }
        }
    };

    const createAnother = () => {
        if (actionToEdit) {
            const newAction: ActionTO = new ActionTO();
            newAction.sequenceStepFk = actionToEdit.sequenceStepFk;
            newAction.index = actionToEdit.index + 1;
            dispatch(EditAction.create(newAction));
            setKey(key + 1);
        }
    };

    return {
        label: 'EDIT * SEQUENCE * STEP * ACTION',
        action: actionToEdit,
        setActor,
        setAction,
        setData,
        sendingActorId: actionToEdit?.sendingActorFk,
        receivingActorId: actionToEdit?.receivingActorFk,
        dataId: actionToEdit?.dataFk === -1 ? undefined : actionToEdit?.dataFk,
        actionType: actionToEdit?.actionType,
        deleteAction,
        deleteActionToEdit,
        setMode,
        createAnother,
        key,
        setDataAndInstance,
        dataAndInstance: JSON.stringify({
            dataFk: actionToEdit?.dataFk,
            instanceId: actionToEdit?.instanceFk,
        }),
        setTriggerLabel,
        triggerLabel: actionToEdit?.actionType === ActionType.TRIGGER ? actionToEdit.triggerText : '',
    };
};
