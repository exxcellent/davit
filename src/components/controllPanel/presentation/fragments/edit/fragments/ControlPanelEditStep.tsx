import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SequenceCTO } from '../../../../../../dataAccess/access/cto/SequenceCTO';
import { SequenceStepCTO } from '../../../../../../dataAccess/access/cto/SequenceStepCTO';
import { ActionTO } from '../../../../../../dataAccess/access/to/ActionTO';
import { DecisionTO } from '../../../../../../dataAccess/access/to/DecisionTO';
import { GoTo, GoToTypes } from '../../../../../../dataAccess/access/types/GoToType';
import { EditActions, editSelectors } from '../../../../../../slices/EditSlice';
import { handleError } from '../../../../../../slices/GlobalSlice';
import { MasterDataActions } from '../../../../../../slices/MasterDataSlice';
import { SequenceModelActions, sequenceModelSelectors } from '../../../../../../slices/SequenceModelSlice';
import { EditAction } from '../../../../../../slices/thunks/ActionThunks';
import { EditSequence } from '../../../../../../slices/thunks/SequenceThunks';
import { EditStep } from '../../../../../../slices/thunks/StepThunks';
import { DavitUtil } from '../../../../../../utils/DavitUtil';
import { DavitAddButton } from '../../../../../common/fragments/buttons/DavitAddButton';
import { DavitBackButton } from '../../../../../common/fragments/buttons/DavitBackButton';
import { DavitDeleteButton } from '../../../../../common/fragments/buttons/DavitDeleteButton';
import { DavitRootButton } from '../../../../../common/fragments/buttons/DavitRootButton';
import { DavitLabelTextfield } from '../../../../../common/fragments/DavitLabelTextfield';
import { ActionButtonDropDown } from '../../../../../common/fragments/dropdowns/ActionButtonDropDown';
import { DecisionDropDown } from '../../../../../common/fragments/dropdowns/DecisionDropDown';
import { GoToOptionDropDown } from '../../../../../common/fragments/dropdowns/GoToOptionDropDown';
import { StepDropDown } from '../../../../../common/fragments/dropdowns/StepDropDown';
import { ControlPanelEditSub } from '../common/ControlPanelEditSub';
import { OptionField } from '../common/OptionField';
import { DavitCommentButton } from '../../../../../common/fragments/buttons/DavitCommentButton';
import { AddOrEdit } from '../../../../../common/fragments/AddOrEdit';

export interface ControlPanelEditStepProps {
    hidden: boolean;
}

export const ControlPanelEditStep: FunctionComponent<ControlPanelEditStepProps> = (props) => {
    const { hidden } = props;

    const {
        label,
        name,
        changeName,
        deleteSequenceStep,
        saveSequenceStep,
        editOrAddAction,
        updateStep,
        handleType,
        setGoToTypeStep,
        goTo,
        setGoToTypeDecision,
        createGoToStep,
        createGoToDecision,
        setRoot,
        isRoot,
        key,
        stepId,
        note,
        saveNote,
    } = useControllPanelEditSequenceStepViewModel();

    return (
        <ControlPanelEditSub label={label} key={key} hidden={hidden} onClickNavItem={saveSequenceStep}>
            <div className='controllPanelEditChild'>
                <div className='optionField'>
                    <OptionField label='Step - name'>
                        <DavitLabelTextfield
                            label='Name:'
                            placeholder='Step Name ...'
                            onChangeDebounced={(name: string) => changeName(name)}
                            value={name}
                            focus={true}
                            onBlur={updateStep}
                        />
                    </OptionField>
                </div>
            </div>
            <div className='columnDivider controllPanelEditChild'>
                <div>
                    <OptionField label='Create / Edit | Step - Action'>
                        <AddOrEdit addCallBack={() => {
                            editOrAddAction();
                            updateStep();
                        }} label={'Action'} dropDown={<ActionButtonDropDown
                            onSelect={(action) => {
                                editOrAddAction(action);
                                updateStep();
                            }}
                            icon={'wrench'}
                        />} />
                    </OptionField>
                </div>
            </div>
            <div className='columnDivider controllPanelEditChild'>
                <div className='optionField'>
                    <OptionField label='Select type of the next element'>
                        <GoToOptionDropDown onSelect={handleType} value={goTo ? goTo.type : GoToTypes.ERROR} />
                    </OptionField>
                    {goTo!.type === GoToTypes.STEP && (
                        <OptionField label='Create or Select next step'>
                            <DavitAddButton onClick={createGoToStep} />
                            <StepDropDown
                                onSelect={setGoToTypeStep}
                                value={goTo?.type === GoToTypes.STEP ? goTo.id : 1}
                                exclude={stepId}
                            />
                        </OptionField>
                    )}
                    {goTo!.type === GoToTypes.DEC && (
                        <OptionField label='Create or Select next decision'>
                            <DavitAddButton onClick={createGoToDecision} />
                            <DecisionDropDown
                                onSelect={setGoToTypeDecision}
                                value={goTo?.type === GoToTypes.DEC ? goTo.id : 1}
                            />
                        </OptionField>
                    )}
                </div>
            </div>
            <div className='columnDivider controllPanelEditChild'>
                <div>
                    <OptionField label='Navigation'>
                        <DavitCommentButton onSaveCallback={saveNote} comment={note} />
                        <DavitBackButton onClick={saveSequenceStep} />
                    </OptionField>
                </div>
                <div className='controllPanelEditChild'>
                    <div>
                        <OptionField label='Sequence - Options'>
                            <DavitRootButton onClick={setRoot} isRoot={isRoot} />
                            <div>
                                <DavitDeleteButton onClick={deleteSequenceStep} />
                            </div>
                        </OptionField>
                    </div>
                </div>
            </div>
        </ControlPanelEditSub>
    );
};

const useControllPanelEditSequenceStepViewModel = () => {
    const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.selectStepToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useDispatch();
    const [currentGoTo, setCurrentGoTo] = useState<GoTo>({
        type: GoToTypes.STEP,
        id: -1,
    });
    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        if (stepToEdit === undefined || null) {
            handleError('Tried to go to edit sequence step without sequenceStepToEdit specified');
            dispatch(EditActions.setMode.edit());
        }
        if (stepToEdit) {
            setCurrentGoTo(stepToEdit.squenceStepTO.goto);
        }

    }, [dispatch, stepToEdit]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit)) {
            const copySequenceStep: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            copySequenceStep.squenceStepTO.name = name;
            dispatch(EditActions.setMode.editStep(copySequenceStep));
            dispatch(EditStep.save(copySequenceStep));
            dispatch(SequenceModelActions.setCurrentSequence(copySequenceStep.squenceStepTO.sequenceFk));
        }
    };

    const saveSequenceStep = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            if (stepToEdit!.squenceStepTO.name !== '') {
                dispatch(EditStep.save(stepToEdit!));
            } else {
                dispatch(EditStep.delete(stepToEdit!, selectedSequence!));
            }
            if (newMode && newMode === 'EDIT') {
                dispatch(EditActions.setMode.edit());
            } else {
                dispatch(EditActions.setMode.editSequence(stepToEdit!.squenceStepTO.sequenceFk));
            }
        }
    };

    const deleteSequenceStep = () => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            dispatch(EditStep.delete(stepToEdit!, selectedSequence!));
            dispatch(EditActions.setMode.editSequence(stepToEdit!.squenceStepTO.sequenceFk));
        }
    };

    const updateStep = () => {
        if (stepToEdit !== null && undefined) {
            const copySequenceStep: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            dispatch(EditStep.save(copySequenceStep));
        }
    };

    const editOrAddAction = (action?: ActionTO) => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit)) {
            let copyAction: ActionTO | undefined = DavitUtil.deepCopy(action);
            if (copyAction === undefined) {
                copyAction = new ActionTO();
                copyAction.sequenceStepFk = stepToEdit!.squenceStepTO.id;
                copyAction.index = stepToEdit!.actions.length;
                dispatch(EditAction.create(copyAction));
            } else {
                dispatch(EditActions.setMode.editAction(copyAction));
            }
        }
    };

    const validStep = (): boolean => {
        let valid: boolean = false;
        if (!DavitUtil.isNullOrUndefined(stepToEdit)) {
            if (stepToEdit!.squenceStepTO.name !== '') {
                valid = true;
            }
        }
        return valid;
    };

    const saveGoToType = (goTo: GoTo) => {
        if (goTo !== undefined) {
            const copySequenceStep: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            copySequenceStep.squenceStepTO.goto = goTo;
            dispatch(EditStep.update(copySequenceStep));
            dispatch(EditStep.save(copySequenceStep));
            dispatch(SequenceModelActions.setCurrentSequence(copySequenceStep.squenceStepTO.sequenceFk));
        }
    };

    const handleType = (newGoToType?: string) => {
        if (newGoToType !== undefined) {
            const gType = { type: (GoToTypes as any)[newGoToType] };
            setCurrentGoTo(gType);
            switch (newGoToType) {
                case GoToTypes.ERROR:
                    saveGoToType(gType);
                    break;
                case GoToTypes.FIN:
                    saveGoToType(gType);
                    break;
                case GoToTypes.IDLE:
                    saveGoToType(gType);
            }
        }
    };

    const setGoToTypeStep = (step?: SequenceStepCTO) => {
        if (step) {
            const newGoTo: GoTo = { type: GoToTypes.STEP, id: step.squenceStepTO.id };
            saveGoToType(newGoTo);
        }
    };

    const setGoToTypeDecision = (decision?: DecisionTO) => {
        if (decision) {
            const newGoTo: GoTo = { type: GoToTypes.DEC, id: decision.id };
            saveGoToType(newGoTo);
        }
    };

    const createGoToStep = () => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit)) {
            const goToStep: SequenceStepCTO = new SequenceStepCTO();
            goToStep.squenceStepTO.sequenceFk = stepToEdit!.squenceStepTO.sequenceFk;
            const copyStepToEdit: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            setKey(key + 1);
            dispatch(EditActions.setMode.editStep(goToStep, copyStepToEdit));
            dispatch(SequenceModelActions.setCurrentSequence(goToStep.squenceStepTO.sequenceFk));
        }
    };

    const createGoToDecision = () => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit)) {
            const goToDecision: DecisionTO = new DecisionTO();
            goToDecision.sequenceFk = stepToEdit!.squenceStepTO.sequenceFk;
            const copyStepToEdit: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            dispatch(EditActions.setMode.editDecision(goToDecision, copyStepToEdit));
        }
    };

    const setRoot = () => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {
            dispatch(EditSequence.setRoot(stepToEdit!.squenceStepTO.sequenceFk, stepToEdit!.squenceStepTO.id, false));
            const step: SequenceStepCTO | undefined = MasterDataActions.find.findSequenceStepCTO(
                stepToEdit!.squenceStepTO.id,
            );
            if (step) {
                dispatch(EditActions.setMode.editStep(step));
            } else {
                dispatch(EditActions.setMode.edit());
            }
        }
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(stepToEdit) && text !== '') {
            const copySequenceStep: SequenceStepCTO = DavitUtil.deepCopy(stepToEdit);
            copySequenceStep.squenceStepTO.note = text;
            dispatch(EditActions.setMode.editStep(copySequenceStep));
            dispatch(EditStep.save(copySequenceStep));
            dispatch(SequenceModelActions.setCurrentSequence(copySequenceStep.squenceStepTO.sequenceFk));
        }
    };

    return {
        label: 'EDIT * ' + (selectedSequence?.sequenceTO.name || '') + ' * ' + (stepToEdit?.squenceStepTO.name || ''),
        name: stepToEdit ? stepToEdit!.squenceStepTO.name : '',
        changeName,
        saveSequenceStep,
        deleteSequenceStep,
        validStep,
        editOrAddAction,
        updateStep,
        handleType,
        goTo: currentGoTo,
        setGoToTypeStep,
        setGoToTypeDecision,
        createGoToStep,
        createGoToDecision,
        setRoot,
        isRoot: stepToEdit?.squenceStepTO.root ? stepToEdit?.squenceStepTO.root : false,
        key,
        stepId: stepToEdit?.squenceStepTO.id,
        note: stepToEdit ? stepToEdit.squenceStepTO.note : '',
        saveNote,
    };
};