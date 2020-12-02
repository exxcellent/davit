import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from 'semantic-ui-react';
import { isNullOrUndefined } from 'util';
import { SequenceCTO } from '../../../../../../dataAccess/access/cto/SequenceCTO';
import { SequenceStepCTO } from '../../../../../../dataAccess/access/cto/SequenceStepCTO';
import { DecisionTO } from '../../../../../../dataAccess/access/to/DecisionTO';
import { GoTo, GoToTypes } from '../../../../../../dataAccess/access/types/GoToType';
import { EditActions, editSelectors } from '../../../../../../slices/EditSlice';
import { handleError } from '../../../../../../slices/GlobalSlice';
import { SequenceModelActions, sequenceModelSelectors } from '../../../../../../slices/SequenceModelSlice';
import { DavitUtil } from '../../../../../../utils/DavitUtil';
import { Carv2DeleteButton } from '../../../../../common/fragments/buttons/Carv2DeleteButton';
import { DavitButtonIcon } from '../../../../../common/fragments/buttons/DavitButton';
import { DavitRootButton } from '../../../../../common/fragments/buttons/DavitRootButton';
import { DecisionDropDown } from '../../../../../common/fragments/dropdowns/DecisionDropDown';
import { GoToOptionDropDown } from '../../../../../common/fragments/dropdowns/GoToOptionDropDown';
import { StepDropDown } from '../../../../../common/fragments/dropdowns/StepDropDown';
import { ControllPanelEditSub } from '../common/ControllPanelEditSub';
import { DavitLabelTextfield } from '../common/fragments/Carv2LabelTextfield';
import { OptionField } from '../common/OptionField';

export interface ControllPanelEditDecisionProps {
    hidden: boolean;
}

export const ControllPanelEditDecision: FunctionComponent<ControllPanelEditDecisionProps> = (props) => {
    const { hidden } = props;
    const {
        label,
        name,
        changeName,
        saveDecision,
        textInput,
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
    } = useControllPanelEditConditionViewModel();

    return (
        <ControllPanelEditSub label={label} key={key} hidden={hidden} onClickNavItem={saveDecision}>
            <div className="controllPanelEditChild">
                <div className="optionField">
                    <OptionField label="Decision - name">
                        <DavitLabelTextfield
                            label="Name:"
                            placeholder="Decision name ..."
                            onChange={(event: any) => changeName(event.target.value)}
                            value={name}
                            autoFocus
                            ref={textInput}
                            onBlur={() => updateDecision()}
                            unvisible={hidden}
                        />
                    </OptionField>
                    <OptionField label="Create / Edit Condition">
                        <Button.Group>
                            <Button id="buttonGroupLabel" disabled inverted color="orange">
                                Condition
                            </Button>
                            <Button icon="wrench" inverted color="orange" onClick={editOrAddCondition} />
                        </Button.Group>
                    </OptionField>
                </div>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <OptionField label="Type condition true">
                        <GoToOptionDropDown
                            onSelect={(gt) => handleType(true, gt)}
                            value={ifGoTo ? ifGoTo.type : GoToTypes.FIN}
                        />
                    </OptionField>
                    {ifGoTo!.type === GoToTypes.STEP && (
                        <OptionField label="Create or Select next step">
                            <DavitButtonIcon icon="add" onClick={() => createGoToStep(true)} />
                            <StepDropDown
                                onSelect={(step) => setGoToTypeStep(true, step)}
                                value={ifGoTo?.type === GoToTypes.STEP ? ifGoTo.id : 1}
                            />
                        </OptionField>
                    )}
                    {ifGoTo!.type === GoToTypes.DEC && (
                        <OptionField label="Create or Select next condition">
                            <DavitButtonIcon icon="add" onClick={() => createGoToDecision(true)} />
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <OptionField label="Type condition false">
                        <GoToOptionDropDown
                            onSelect={(gt) => handleType(false, gt)}
                            value={elseGoTo ? elseGoTo.type : GoToTypes.ERROR}
                        />
                    </OptionField>
                    {elseGoTo!.type === GoToTypes.STEP && (
                        <OptionField label="Select type of the next element">
                            <DavitButtonIcon icon="add" onClick={() => createGoToStep(false)} />
                            <StepDropDown
                                onSelect={(step) => setGoToTypeStep(false, step)}
                                value={elseGoTo?.type === GoToTypes.STEP ? elseGoTo.id : 1}
                            />
                        </OptionField>
                    )}
                    {elseGoTo!.type === GoToTypes.DEC && (
                        <OptionField label="Create or Select next condition">
                            <DavitButtonIcon icon="add" onClick={() => createGoToDecision(false)} />
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
                        <DavitButtonIcon onClick={saveDecision} icon="reply" />
                    </OptionField>
                </div>
                <div className="controllPanelEditChild">
                    <div>
                        <OptionField label="Sequence - Options">
                            <DavitRootButton onClick={setRoot} isRoot={isRoot} />
                            <div>
                                <Carv2DeleteButton onClick={deleteDecision} />
                            </div>
                        </OptionField>
                    </div>
                </div>
            </div>
        </ControllPanelEditSub>
    );
};

const useControllPanelEditConditionViewModel = () => {
    const decisionToEdit: DecisionTO | null = useSelector(editSelectors.decisionToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useDispatch();
    const textInput = useRef<Input>(null);
    const [currentIfGoTo, setCurrentIfGoTo] = useState<GoTo>({ type: GoToTypes.STEP, id: -1 });
    const [currentElseGoTo, setCurrentElseGoTo] = useState<GoTo>({ type: GoToTypes.STEP, id: -1 });
    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        if (isNullOrUndefined(decisionToEdit)) {
            console.warn(decisionToEdit);
            dispatch(handleError('Tried to go to edit condition step without conditionToEdit specified'));
            dispatch(EditActions.setMode.edit());
        }
        if (decisionToEdit) {
            setCurrentIfGoTo(decisionToEdit.ifGoTo);
            setCurrentElseGoTo(decisionToEdit.elseGoTo);
        }
        // used to focus the textfield on create another
        textInput.current!.focus();
    }, [dispatch, decisionToEdit]);

    const changeName = (name: string) => {
        if (!isNullOrUndefined(decisionToEdit)) {
            const copyConditionToEdit: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyConditionToEdit.name = name;
            dispatch(EditActions.setMode.editDecision(copyConditionToEdit));
            dispatch(SequenceModelActions.setCurrentSequence(copyConditionToEdit.sequenceFk));
        }
    };

    const saveDecision = (newMode?: string) => {
        if (!isNullOrUndefined(decisionToEdit) && !isNullOrUndefined(selectedSequence)) {
            if (decisionToEdit.name !== '') {
                dispatch(EditActions.decision.save(decisionToEdit));
            } else {
                dispatch(EditActions.decision.delete(decisionToEdit, selectedSequence));
            }
            if (newMode && newMode === 'EDIT') {
                dispatch(EditActions.setMode.edit());
            } else {
                dispatch(EditActions.setMode.editSequence(decisionToEdit.sequenceFk));
            }
        }
    };

    const deleteDecision = () => {
        if (!isNullOrUndefined(decisionToEdit) && !isNullOrUndefined(selectedSequence)) {
            dispatch(EditActions.decision.delete(decisionToEdit, selectedSequence));
            dispatch(EditActions.setMode.editSequence(decisionToEdit.sequenceFk));
        }
    };

    const updateDecision = () => {
        const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
        dispatch(EditActions.decision.save(copyDecision));
    };

    const validStep = (): boolean => {
        let valid: boolean = false;
        if (!isNullOrUndefined(decisionToEdit)) {
            if (decisionToEdit.name !== '') {
                valid = true;
            }
        }
        return valid;
    };

    const saveGoToType = (ifGoTo: Boolean, goTo: GoTo) => {
        if (goTo !== undefined) {
            const copyDecisionToEdit: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            ifGoTo ? (copyDecisionToEdit.ifGoTo = goTo) : (copyDecisionToEdit.elseGoTo = goTo);
            dispatch(EditActions.decision.update(copyDecisionToEdit));
            dispatch(EditActions.decision.save(copyDecisionToEdit));
            dispatch(SequenceModelActions.setCurrentSequence(copyDecisionToEdit.sequenceFk));
        }
    };

    const handleType = (ifGoTo: Boolean, newGoToType?: string) => {
        if (newGoToType !== undefined) {
            const gType = { type: (GoToTypes as any)[newGoToType] };
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
            const newGoTo: GoTo = { type: GoToTypes.STEP, id: step.squenceStepTO.id };
            saveGoToType(ifGoTo, newGoTo);
        }
    };

    const setGoToTypeDecision = (ifGoTo: Boolean, decision?: DecisionTO) => {
        if (decision) {
            const newGoTo: GoTo = { type: GoToTypes.DEC, id: decision.id };
            saveGoToType(ifGoTo, newGoTo);
        }
    };

    const createGoToStep = (ifGoTo: boolean) => {
        if (!isNullOrUndefined(decisionToEdit)) {
            const goToStep: SequenceStepCTO = new SequenceStepCTO();
            goToStep.squenceStepTO.sequenceFk = decisionToEdit.sequenceFk;
            const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
            dispatch(EditActions.setMode.editStep(goToStep, copyDecision, ifGoTo));
        }
    };

    const createGoToDecision = (ifGoTo: Boolean) => {
        if (!isNullOrUndefined(decisionToEdit)) {
            const goToDecision: DecisionTO = new DecisionTO();
            goToDecision.sequenceFk = decisionToEdit.sequenceFk;
            const copyStepToEdit: SequenceStepCTO = DavitUtil.deepCopy(decisionToEdit);
            dispatch(EditActions.setMode.editDecision(goToDecision, copyStepToEdit, ifGoTo));
            setKey(key + 1);
        }
    };

    const setRoot = () => {
        if (!isNullOrUndefined(decisionToEdit)) {
            dispatch(EditActions.sequence.setRoot(decisionToEdit.sequenceFk, decisionToEdit.id, true));
            dispatch(EditActions.setMode.editDecision(EditActions.decision.find(decisionToEdit.id)));
        }
    };

    const editOrAddCondition = () => {
        if (decisionToEdit !== null) {
            dispatch(EditActions.setMode.editCondition(decisionToEdit));
        }
    };

    return {
        label: 'EDIT * ' + (selectedSequence?.sequenceTO.name || '') + ' * ' + (decisionToEdit?.name || ''),
        name: decisionToEdit?.name,
        changeName,
        saveDecision,
        textInput,
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
    };
};
