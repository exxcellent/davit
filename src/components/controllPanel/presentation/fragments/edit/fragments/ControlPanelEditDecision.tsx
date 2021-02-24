import React, {FunctionComponent, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "semantic-ui-react";
import {SequenceCTO} from "../../../../../../dataAccess/access/cto/SequenceCTO";
import {SequenceStepCTO} from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import {ConditionTO} from "../../../../../../dataAccess/access/to/ConditionTO";
import {DecisionTO} from "../../../../../../dataAccess/access/to/DecisionTO";
import {GoTo, GoToTypes} from "../../../../../../dataAccess/access/types/GoToType";
import {EditActions, editSelectors} from "../../../../../../slices/EditSlice";
import {handleError} from "../../../../../../slices/GlobalSlice";
import {SequenceModelActions, sequenceModelSelectors} from "../../../../../../slices/SequenceModelSlice";
import {EditDecision} from "../../../../../../slices/thunks/DecisionThunks";
import {EditSequence} from "../../../../../../slices/thunks/SequenceThunks";
import {DavitUtil} from "../../../../../../utils/DavitUtil";
import {DavitAddButton} from "../../../../../common/fragments/buttons/DavitAddButton";
import {DavitBackButton} from "../../../../../common/fragments/buttons/DavitBackButton";
import {DavitDeleteButton} from "../../../../../common/fragments/buttons/DavitDeleteButton";
import {DavitRootButton} from "../../../../../common/fragments/buttons/DavitRootButton";
import {DavitLabelTextfield} from "../../../../../common/fragments/DavitLabelTextfield";
import {DavitModal} from "../../../../../common/fragments/DavitModal";
import {ConditionDropDownButton} from "../../../../../common/fragments/dropdowns/ConditionDropDown";
import {DecisionDropDown} from "../../../../../common/fragments/dropdowns/DecisionDropDown";
import {GoToOptionDropDown} from "../../../../../common/fragments/dropdowns/GoToOptionDropDown";
import {StepDropDown} from "../../../../../common/fragments/dropdowns/StepDropDown";
import {DavitNoteForm} from "../../../../../common/fragments/forms/DavitNoteForm";
import {ControlPanelEditSub} from "../common/ControlPanelEditSub";
import {OptionField} from "../common/OptionField";

export interface ControlPanelEditDecisionProps {
    hidden: boolean;
}

export const ControlPanelEditDecision: FunctionComponent<ControlPanelEditDecisionProps> = (props) => {
    const {hidden} = props;

    const [showNote, setShowNote] = useState<boolean>(false);

    const {
        label,
        name,
        changeName,
        saveDecision,
        handleType,
        ifGoTo,
        elseGoTo,
        setGoToTypeStep,
        createGoToStep,
        setRoot,
        isRoot,
        key,
        updateDecision,
        deleteDecision,
        createGoToDecision,
        setGoToTypeDecision,
        editOrAddCondition,
        decId,
        conditions,
        note,
        saveNote,
    } = useControlPanelEditConditionViewModel();

    return (
        <ControlPanelEditSub label={label} key={key} hidden={hidden} onClickNavItem={saveDecision}>
            <div className="controllPanelEditChild">
                <div className="optionField">
                    <OptionField label="Decision - name">
                        <DavitLabelTextfield
                            label="Name:"
                            placeholder="Decision name ..."
                            onChangeDebounced={(name: string) => changeName(name)}
                            value={name}
                            focus={true}
                            onBlur={updateDecision}
                        />
                    </OptionField>
                    <OptionField label="Create / Edit Condition">
                        <Button.Group>
                            <Button icon="add" inverted color="orange" onClick={() => editOrAddCondition()}/>
                            <Button id="buttonGroupLabel" disabled inverted color="orange">
                                Condition
                            </Button>
                            <ConditionDropDownButton
                                conditions={conditions}
                                icon="wrench"
                                onSelect={editOrAddCondition}
                            />
                        </Button.Group>
                    </OptionField>
                </div>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <OptionField label="Type condition true">
                        <GoToOptionDropDown
                            onSelect={(gt) => handleType(true, gt)}
                            value={ifGoTo ? ifGoTo.type : GoToTypes.FIN}
                        />
                    </OptionField>
                    {ifGoTo!.type === GoToTypes.STEP && (
                        <OptionField label="Create or Select next step">
                            <DavitAddButton onClick={() => createGoToStep(true)}/>
                            <StepDropDown
                                onSelect={(step) => setGoToTypeStep(true, step)}
                                value={ifGoTo?.type === GoToTypes.STEP ? ifGoTo.id : 1}
                            />
                        </OptionField>
                    )}
                    {ifGoTo!.type === GoToTypes.DEC && (
                        <OptionField label="Create or Select next condition">
                            <DavitAddButton onClick={() => createGoToDecision(true)}/>
                            <DecisionDropDown
                                onSelect={(cond) => setGoToTypeDecision(true, cond)}
                                value={ifGoTo?.type === GoToTypes.DEC ? ifGoTo.id : 1}
                                exclude={decId}
                            />
                        </OptionField>
                    )}
                </div>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <OptionField label="Type condition false">
                        <GoToOptionDropDown
                            onSelect={(gt) => handleType(false, gt)}
                            value={elseGoTo ? elseGoTo.type : GoToTypes.ERROR}
                        />
                    </OptionField>
                    {elseGoTo!.type === GoToTypes.STEP && (
                        <OptionField label="Select type of the next element">
                            <DavitAddButton onClick={() => createGoToStep(false)}/>
                            <StepDropDown
                                onSelect={(step) => setGoToTypeStep(false, step)}
                                value={elseGoTo?.type === GoToTypes.STEP ? elseGoTo.id : 1}
                            />
                        </OptionField>
                    )}
                    {elseGoTo!.type === GoToTypes.DEC && (
                        <OptionField label="Create or Select next condition">
                            <DavitAddButton onClick={() => createGoToDecision(false)}/>
                            <DecisionDropDown
                                onSelect={(cond) => setGoToTypeDecision(false, cond)}
                                value={elseGoTo?.type === GoToTypes.DEC ? elseGoTo.id : 1}
                                exclude={decId}
                            />
                        </OptionField>
                    )}
                </div>
            </div>
            <div className="columnDivider controllPanelEditChild">
                <div>
                    <OptionField label="Navigation">
                        <button onClick={() => setShowNote(true)}>Note</button>
                        {showNote && (
                            <DavitModal
                                content={
                                    <DavitNoteForm
                                        text={note}
                                        onSubmit={(text: string) => {
                                            setShowNote(false);
                                            saveNote(text);
                                        }}
                                        onCancel={() => setShowNote(false)}
                                    />
                                }
                            />
                        )}
                        <DavitBackButton onClick={saveDecision}/>
                    </OptionField>
                </div>
                <div className="controllPanelEditChild">
                    <div>
                        <OptionField label="Sequence - Options">
                            <DavitRootButton onClick={setRoot} isRoot={isRoot}/>
                            <div>
                                <DavitDeleteButton onClick={deleteDecision}/>
                            </div>
                        </OptionField>
                    </div>
                </div>
            </div>
        </ControlPanelEditSub>
    );
};

const useControlPanelEditConditionViewModel = () => {
    const decisionToEdit: DecisionTO | null = useSelector(editSelectors.selectDecisionToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useDispatch();
    const [currentIfGoTo, setCurrentIfGoTo] = useState<GoTo>({type: GoToTypes.STEP, id: -1});
    const [currentElseGoTo, setCurrentElseGoTo] = useState<GoTo>({type: GoToTypes.STEP, id: -1});
    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        if (DavitUtil.isNullOrUndefined(decisionToEdit)) {
            dispatch(handleError("Tried to go to edit condition step without conditionToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }
        if (decisionToEdit) {
            setCurrentIfGoTo(decisionToEdit.ifGoTo);
            setCurrentElseGoTo(decisionToEdit.elseGoTo);
        }

    }, [dispatch, decisionToEdit]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyConditionToEdit: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyConditionToEdit.name = name;
            dispatch(EditActions.setMode.editDecision(copyConditionToEdit));
            dispatch(SequenceModelActions.setCurrentSequence(copyConditionToEdit.sequenceFk));
        }
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyConditionToEdit: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyConditionToEdit.note = text;
            dispatch(EditActions.setMode.editDecision(copyConditionToEdit));
            dispatch(SequenceModelActions.setCurrentSequence(copyConditionToEdit.sequenceFk));
        }
    };

    const saveDecision = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            if (decisionToEdit!.name !== "") {
                dispatch(EditDecision.save(decisionToEdit!));
            } else {
                dispatch(EditDecision.delete(decisionToEdit!, selectedSequence!));
            }
            if (newMode && newMode === "EDIT") {
                dispatch(EditActions.setMode.edit());
            } else {
                dispatch(EditActions.setMode.editSequence(decisionToEdit!.sequenceFk));
            }
        }
    };

    const deleteDecision = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            dispatch(EditDecision.delete(decisionToEdit!, selectedSequence!));
            dispatch(EditActions.setMode.editSequence(decisionToEdit!.sequenceFk));
        }
    };

    const updateDecision = () => {
        const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
        dispatch(EditDecision.save(copyDecision));
    };

    const validStep = (): boolean => {
        let valid: boolean = false;
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            if (decisionToEdit!.name !== "") {
                valid = true;
            }
        }
        return valid;
    };

    const saveGoToType = (ifGoTo: Boolean, goTo: GoTo) => {
        if (goTo !== undefined) {
            const copyDecisionToEdit: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            ifGoTo ? (copyDecisionToEdit.ifGoTo = goTo) : (copyDecisionToEdit.elseGoTo = goTo);
            dispatch(EditDecision.update(copyDecisionToEdit));
            dispatch(EditDecision.save(copyDecisionToEdit));
            dispatch(SequenceModelActions.setCurrentSequence(copyDecisionToEdit.sequenceFk));
        }
    };

    const handleType = (ifGoTo: Boolean, newGoToType?: string) => {
        if (newGoToType !== undefined) {
            const gType = {type: (GoToTypes as any)[newGoToType]};
            ifGoTo ? setCurrentIfGoTo(gType) : setCurrentElseGoTo(gType);
            switch (newGoToType) {
                case GoToTypes.ERROR:
                    saveGoToType(ifGoTo, gType);
                    break;
                case GoToTypes.FIN:
                    saveGoToType(ifGoTo, gType);
                    break;
                case GoToTypes.IDLE:
                    saveGoToType(ifGoTo, gType);
                    break;
            }
        }
    };

    const setGoToTypeStep = (ifGoTo: Boolean, step?: SequenceStepCTO) => {
        if (step) {
            const newGoTo: GoTo = {type: GoToTypes.STEP, id: step.squenceStepTO.id};
            saveGoToType(ifGoTo, newGoTo);
        }
    };

    const setGoToTypeDecision = (ifGoTo: Boolean, decision?: DecisionTO) => {
        if (decision) {
            const newGoTo: GoTo = {type: GoToTypes.DEC, id: decision.id};
            saveGoToType(ifGoTo, newGoTo);
        }
    };

    const createGoToStep = (ifGoTo: boolean) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const goToStep: SequenceStepCTO = new SequenceStepCTO();
            goToStep.squenceStepTO.sequenceFk = decisionToEdit!.sequenceFk;
            const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            dispatch(EditActions.setMode.editStep(goToStep, copyDecision, ifGoTo));
        }
    };

    const createGoToDecision = (ifGoTo: Boolean) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const goToDecision: DecisionTO = new DecisionTO();
            goToDecision.sequenceFk = decisionToEdit!.sequenceFk;
            const copyStepToEdit: SequenceStepCTO = DavitUtil.deepCopy(decisionToEdit);
            dispatch(EditActions.setMode.editDecision(goToDecision, copyStepToEdit, ifGoTo));
            setKey(key + 1);
        }
    };

    const setRoot = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            dispatch(EditSequence.setRoot(decisionToEdit!.sequenceFk, decisionToEdit!.id, true));
            dispatch(EditActions.setMode.editDecision(EditDecision.find(decisionToEdit!.id)));
        }
    };

    const editOrAddCondition = (conditionId?: number) => {
        let conditionToEdit: ConditionTO | undefined;

        if (decisionToEdit !== null) {
            if (!DavitUtil.isNullOrUndefined(conditionId)) {
                conditionToEdit = decisionToEdit.conditions.find((condition) => condition.id === conditionId);
            }

            dispatch(EditActions.setMode.editCondition(decisionToEdit, conditionToEdit));
        }
    };

    return {
        label: "EDIT * " + (selectedSequence?.sequenceTO.name || "") + " * " + (decisionToEdit?.name || ""),
        name: decisionToEdit?.name,
        changeName,
        saveDecision,
        validStep,
        updateDecision,
        deleteDecision,
        handleType,
        setGoToTypeStep,
        setGoToTypeDecision,
        ifGoTo: currentIfGoTo,
        elseGoTo: currentElseGoTo,
        createGoToStep,
        createGoToDecision,
        setRoot,
        isRoot: decisionToEdit?.root ? decisionToEdit.root : false,
        key,
        editOrAddCondition,
        decId: decisionToEdit?.id,
        conditions: decisionToEdit?.conditions || [],
        note: decisionToEdit ? decisionToEdit.note : "",
        saveNote,
    };
};
