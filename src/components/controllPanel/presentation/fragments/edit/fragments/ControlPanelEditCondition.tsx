import React, {FunctionComponent, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SequenceCTO} from "../../../../../../dataAccess/access/cto/SequenceCTO";
import {ConditionTO} from "../../../../../../dataAccess/access/to/ConditionTO";
import {EditActions, editSelectors} from "../../../../../../slices/EditSlice";
import {sequenceModelSelectors} from "../../../../../../slices/SequenceModelSlice";
import {EditCondition} from "../../../../../../slices/thunks/ConditionThunks";
import {EditDecision} from "../../../../../../slices/thunks/DecisionThunks";
import {DavitUtil} from "../../../../../../utils/DavitUtil";
import {DavitBackButton} from "../../../../../common/fragments/buttons/DavitBackButton";
import {DavitDeleteButton} from "../../../../../common/fragments/buttons/DavitDeleteButton";
import {DavitMenuLabel} from "../../../../../common/fragments/DavitMenuLabel";
import {ActorDropDown} from "../../../../../common/fragments/dropdowns/ActorDropDown";
import {DataAndInstanceId, InstanceDropDown} from "../../../../../common/fragments/dropdowns/InstanceDropDown";
import {ControlPanelEditSub} from "../common/ControlPanelEditSub";
import {OptionField} from "../common/OptionField";
import {GlobalActions} from "../../../../../../slices/GlobalSlice";

export interface ControlPanelEditConditionProps {
    hidden: boolean;
}

export const ControlPanelEditCondition: FunctionComponent<ControlPanelEditConditionProps> = (props) => {
    const {hidden} = props;
    const {
        label,
        setMode,
        actorFk,
        setActorFk,
        setData,
        selectedData,
        deleteConditionAndGoToEditDecision,
    } = useControllPanelEditConditionViewModel();

    return (
        <ControlPanelEditSub label={label} hidden={hidden} onClickNavItem={setMode}>
            <div className="optionFieldSpacer">
                <OptionField label="Select Actor">
                    <ActorDropDown
                        value={actorFk?.toString()}
                        onSelect={(actor) => setActorFk(actor?.actor.id || -1)}
                    />
                </OptionField>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <DavitMenuLabel text="HAS"/>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <OptionField label="Select data for actor">
                    <InstanceDropDown
                        onSelect={(data) => {
                            setData(data);
                        }}
                        value={JSON.stringify(selectedData)}
                    />
                </OptionField>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <OptionField label="Navigation">
                    <DavitDeleteButton onClick={deleteConditionAndGoToEditDecision}/>
                    <DavitBackButton onClick={setMode}/>
                </OptionField>
            </div>
        </ControlPanelEditSub>
    );
};

const useControllPanelEditConditionViewModel = () => {
    const conditionToEdit: ConditionTO | null = useSelector(editSelectors.selectConditionToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useDispatch();

    useEffect(() => {
        if (DavitUtil.isNullOrUndefined(conditionToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit condition without conditoin to edit specified"));
            dispatch(EditActions.setMode.edit());
        }
    }, [conditionToEdit, dispatch]);

    const isConditionEmpty = (): boolean => {
        let isEmpty: boolean = true;
        if (!DavitUtil.isNullOrUndefined(conditionToEdit)) {
            isEmpty =
                conditionToEdit!.actorFk === -1 && conditionToEdit!.dataFk === -1 && conditionToEdit!.instanceFk === -1;
        }
        return isEmpty;
    };

    const setMode = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(conditionToEdit)) {
            if (isConditionEmpty()) {
                deleteCondition();
            }

            if (newMode && newMode === "EDIT") {
                dispatch(EditActions.setMode.edit());
            } else if (newMode && newMode === "SEQUENCE") {
                dispatch(EditActions.setMode.editSequence(selectedSequence?.sequenceTO.id));
            } else {
                goBackToEditDecision();
            }
        } else {
            console.info("decisionToEdit is null!");
        }
    };

    const setData = (dataAndInstanceIds: DataAndInstanceId | undefined) => {
        if (!DavitUtil.isNullOrUndefined(conditionToEdit) && !DavitUtil.isNullOrUndefined(dataAndInstanceIds)) {
            const copyConditionToEdit: ConditionTO = DavitUtil.deepCopy(conditionToEdit);
            copyConditionToEdit.dataFk = dataAndInstanceIds!.dataFk;
            copyConditionToEdit.instanceFk = dataAndInstanceIds!.instanceId;
            dispatch(EditCondition.save(copyConditionToEdit));
            dispatch(EditCondition.update(copyConditionToEdit));
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

    const goBackToEditDecision = () => {
        if (!DavitUtil.isNullOrUndefined(conditionToEdit)) {
            dispatch(EditActions.setMode.editDecision(EditDecision.find(conditionToEdit!.decisionFk)));
        }
    };

    const deleteCondition = () => {
        if (!DavitUtil.isNullOrUndefined(conditionToEdit)) {
            const copyCondition: ConditionTO = DavitUtil.deepCopy(conditionToEdit);
            dispatch(EditCondition.delete(copyCondition));
        }
    };

    const deleteConditionAndGoToEditDecision = () => {
        deleteCondition();
        goBackToEditDecision();
    };

    return {
        label:
            "EDIT * " +
            (selectedSequence?.sequenceTO.name || "") +
            " * " +
            (selectedSequence?.decisions.find((decision) => decision.id === conditionToEdit?.decisionFk)?.name || "") +
            " * CONDITION",
        setMode,
        actorFk: conditionToEdit?.actorFk,
        setActorFk,
        setData,
        selectedData: {dataFk: conditionToEdit?.dataFk, instanceId: conditionToEdit?.instanceFk},
        deleteConditionAndGoToEditDecision,
    };
};
