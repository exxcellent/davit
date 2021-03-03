import {faReply} from "@fortawesome/free-solid-svg-icons";
import React, {FunctionComponent, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ActorCTO} from "../../../../../../dataAccess/access/cto/ActorCTO";
import {DataCTO} from "../../../../../../dataAccess/access/cto/DataCTO";
import {SequenceCTO} from "../../../../../../dataAccess/access/cto/SequenceCTO";
import {SequenceStepCTO} from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import {ActionTO} from "../../../../../../dataAccess/access/to/ActionTO";
import {ActionType} from "../../../../../../dataAccess/access/types/ActionType";
import {EditActions, editSelectors} from "../../../../../../slices/EditSlice";
import {MasterDataActions} from "../../../../../../slices/MasterDataSlice";
import {sequenceModelSelectors} from "../../../../../../slices/SequenceModelSlice";
import {EditAction} from "../../../../../../slices/thunks/ActionThunks";
import {DavitUtil} from "../../../../../../utils/DavitUtil";
import {DavitButton} from "../../../../../common/fragments/buttons/DavitButton";
import {DavitDeleteButton} from "../../../../../common/fragments/buttons/DavitDeleteButton";
import {DavitLabelTextfield} from "../../../../../common/fragments/DavitLabelTextfield";
import {ActionTypeDropDown} from "../../../../../common/fragments/dropdowns/ActionTypeDropDown";
import {ActorDropDown} from "../../../../../common/fragments/dropdowns/ActorDropDown";
import {DataDropDown} from "../../../../../common/fragments/dropdowns/DataDropDown";
import {DataAndInstanceId, InstanceDropDown} from "../../../../../common/fragments/dropdowns/InstanceDropDown";
import {OptionField} from "../common/OptionField";
import {GlobalActions} from "../../../../../../slices/GlobalSlice";

export interface ControlPanelEditActionProps {
    hidden: boolean;
}

export const ControlPanelEditAction: FunctionComponent<ControlPanelEditActionProps> = () => {

    const {
        setActor,
        setAction,
        setData,
        deleteAction,
        sendingActorId,
        receivingActorId,
        dataId,
        actionType,
        setMode,
        createAnother,
        setDataAndInstance,
        dataAndInstance,
        setTriggerLabel,
        triggerLabel,
    } = useControlPanelEditActionViewModel();

    return (
        <div className="headerGrid">
            <OptionField>
                <OptionField label="Select action to execute">
                    <ActionTypeDropDown onSelect={setAction} value={actionType}/>
                </OptionField>
                {actionType !== ActionType.TRIGGER && (
                    <OptionField label="Data">
                        {actionType === ActionType.ADD && (
                            <InstanceDropDown onSelect={setDataAndInstance} value={dataAndInstance}/>
                        )}
                        {actionType !== ActionType.ADD && <DataDropDown onSelect={setData} value={dataId}/>}
                    </OptionField>
                )}
                {actionType === ActionType.TRIGGER && (
                    <OptionField label="LABEL">
                        <DavitLabelTextfield
                            placeholder="Trigger text ..."
                            onChangeDebounced={(name: string) => setTriggerLabel(name)}
                            value={triggerLabel}
                        />
                    </OptionField>
                )}
            </OptionField>
            <OptionField>
                <label className="optionFieldLabel" style={{paddingTop: "1em"}}>
                    {actionType === ActionType.ADD ? "TO" : "FROM"}
                </label>
                <OptionField
                    label={
                        actionType?.includes("SEND") || actionType === ActionType.TRIGGER
                            ? "Select sending Actor"
                            : "Actor"
                    }>
                    <ActorDropDown
                        onSelect={(actor) =>
                            setActor(actor, actionType?.includes("SEND") || actionType === ActionType.TRIGGER)
                        }
                        value={
                            actionType?.includes("SEND") || actionType === ActionType.TRIGGER
                                ? sendingActorId?.toString()
                                : receivingActorId?.toString()
                        }
                    />
                </OptionField>
            </OptionField>
            {(actionType?.includes("SEND") || actionType === ActionType.TRIGGER) && (
                <OptionField label=" ">
                    <label className="optionFieldLabel" style={{paddingTop: "1em"}}>
                        TO
                    </label>
                    <OptionField label="Select receiving Actor">
                        <ActorDropDown
                            onSelect={(actor) => setActor(actor, false)}
                            value={receivingActorId?.toString()}
                        />
                    </OptionField>
                </OptionField>
            )}
            <OptionField label="Options">
                <DavitButton onClick={createAnother} label="Create another"/>
                <DavitButton onClick={setMode} iconName={faReply}/>
                <DavitDeleteButton onClick={deleteAction}/>
            </OptionField>
        </div>
    );
};

const useControlPanelEditActionViewModel = () => {
    const actionToEdit: ActionTO | null = useSelector(editSelectors.selectActionToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useDispatch();

    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        // check if actor to edit is really set or gos back to edit mode
        if (actionToEdit === null || actionToEdit === undefined) {
            dispatch(GlobalActions.handleError("Tried to go to edit action without actionToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }
        // used to focus the textfield on create another
    }, [dispatch, actionToEdit]);

    const deleteAction = () => {
        if (actionToEdit !== null) {
            dispatch(EditAction.delete(actionToEdit));

            const step: SequenceStepCTO | undefined = MasterDataActions.find.findSequenceStepCTO(
                actionToEdit.sequenceStepFk,
            );

            if (step) {
                dispatch(EditActions.setMode.editStep(step));
            } else {
                // should never happend but as fallback savty.
                dispatch(GlobalActions.handleError("Step not found!"));
                dispatch(EditActions.setMode.edit());
            }
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
            copyActionToEdit.sendingActorFk = newActionType.includes("SEND") ? actionToEdit.sendingActorFk : -1;
            copyActionToEdit.receivingActorFk = newActionType.includes("SEND") ? actionToEdit.receivingActorFk : -1;
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
                deleteAction();
            }
            if (newMode && newMode === "EDIT") {
                dispatch(EditActions.setMode.edit());
            } else if (newMode && newMode === "SEQUENCE") {
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
        label: "EDIT * SEQUENCE * STEP * ACTION",
        action: actionToEdit,
        setActor,
        setAction,
        setData,
        sendingActorId: actionToEdit?.sendingActorFk,
        receivingActorId: actionToEdit?.receivingActorFk,
        dataId: actionToEdit?.dataFk === -1 ? undefined : actionToEdit?.dataFk,
        actionType: actionToEdit?.actionType,
        deleteAction,
        setMode,
        createAnother,
        key,
        setDataAndInstance,
        dataAndInstance: JSON.stringify({
            dataFk: actionToEdit?.dataFk,
            instanceId: actionToEdit?.instanceFk,
        }),
        setTriggerLabel,
        triggerLabel: actionToEdit?.actionType === ActionType.TRIGGER ? actionToEdit.triggerText : "",
    };
};