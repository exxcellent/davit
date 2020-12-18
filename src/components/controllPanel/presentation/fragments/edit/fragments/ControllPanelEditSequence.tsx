import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from 'semantic-ui-react';
import { SequenceCTO } from '../../../../../../dataAccess/access/cto/SequenceCTO';
import { SequenceStepCTO } from '../../../../../../dataAccess/access/cto/SequenceStepCTO';
import { DecisionTO } from '../../../../../../dataAccess/access/to/DecisionTO';
import { SequenceTO } from '../../../../../../dataAccess/access/to/SequenceTO';
import { EditActions, editSelectors } from '../../../../../../slices/EditSlice';
import { handleError } from '../../../../../../slices/GlobalSlice';
import { sequenceModelSelectors } from '../../../../../../slices/SequenceModelSlice';
import { EditSequence } from '../../../../../../slices/thunks/SequenceThunks';
import { DavitUtil } from '../../../../../../utils/DavitUtil';
import { Carv2DeleteButton } from '../../../../../common/fragments/buttons/Carv2DeleteButton';
import { DavitButtonIcon, DavitButtonLabel } from '../../../../../common/fragments/buttons/DavitButton';
import { DecisionDropDownButton } from '../../../../../common/fragments/dropdowns/DecisionDropDown';
import { StepDropDownButton } from '../../../../../common/fragments/dropdowns/StepDropDown';
import { ControllPanelEditSub } from '../common/ControllPanelEditSub';
import { DavitLabelTextfield } from '../common/fragments/DavitLabelTextfield';
import { OptionField } from '../common/OptionField';

export interface ControllPanelEditSequenceProps {
    hidden: boolean;
}

export const ControllPanelEditSequence: FunctionComponent<ControllPanelEditSequenceProps> = (props) => {
    const { hidden } = props;
    const {
        label,
        name,
        textInput,
        changeName,
        deleteSequence,
        saveSequence,
        editOrAddSequenceStep,
        createAnother,
        updateSequence,
        editOrAddDecision,
        id,
    } = useControllPanelEditSequenceViewModel();

    const menuButtons = (
        <div className="columnDivider controllPanelEditChild">
            <div className="optionFieldSpacer">
                <OptionField label="Navigation">
                    <DavitButtonLabel onClick={createAnother} label="Create another" />
                    <DavitButtonIcon onClick={saveSequence} icon="reply" />
                </OptionField>
            </div>
            <div className="optionFieldSpacer">
                <OptionField label="Sequence - Options">
                    <Carv2DeleteButton onClick={deleteSequence} />
                </OptionField>
            </div>
        </div>
    );

    return (
        <ControllPanelEditSub key={id} label={label} hidden={hidden} onClickNavItem={saveSequence}>
            <div className="optionFieldSpacer">
                <OptionField label="Sequence - name">
                    <DavitLabelTextfield
                        label="Name:"
                        placeholder="Sequence Name..."
                        onChangeDebounced={(name: string) => changeName(name)}
                        value={name}
                        autoFocus
                        ref={textInput}
                        onBlur={updateSequence}
                        unvisible={hidden}
                    />
                </OptionField>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <OptionField label="Create / Edit | Sequence - Step">
                    <Button.Group>
                        <Button icon="add" inverted color="orange" onClick={() => editOrAddSequenceStep()} />
                        <Button id="buttonGroupLabel" disabled inverted color="orange">
                            Step
                        </Button>
                        <StepDropDownButton onSelect={editOrAddSequenceStep} icon="wrench" />
                    </Button.Group>
                </OptionField>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <OptionField label="Create / Edit | Sequence - Decision">
                    <Button.Group>
                        <Button icon="add" inverted color="orange" onClick={() => editOrAddDecision()} />
                        <Button id="buttonGroupLabel" disabled inverted color="orange">
                            Decision
                        </Button>
                        <DecisionDropDownButton onSelect={editOrAddDecision} icon="wrench" />
                    </Button.Group>
                </OptionField>
            </div>
            {menuButtons}
        </ControllPanelEditSub>
    );
};

const useControllPanelEditSequenceViewModel = () => {
    const sequenceToEdit: SequenceTO | null = useSelector(editSelectors.sequenceToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useDispatch();
    const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
    const textInput = useRef<Input>(null);

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            handleError('Tried to go to edit sequence without sequenceToedit specified');
            dispatch(EditActions.setMode.edit());
        }
        if (sequenceToEdit?.id !== -1) {
            setIsCreateAnother(false);
        }
        // used to focus the textfield on create another
        textInput.current!.focus();
    }, [sequenceToEdit, dispatch]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            const copySequenceToEdit: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
            copySequenceToEdit.name = name;
            dispatch(EditSequence.save(copySequenceToEdit));
        }
    };

    const saveSequence = () => {
        if (sequenceToEdit!.name !== '') {
            dispatch(EditSequence.save(sequenceToEdit!));
        } else {
            dispatch(EditSequence.delete(sequenceToEdit!));
        }
        if (isCreateAnother) {
            dispatch(EditActions.setMode.editSequence());
        } else {
            dispatch(EditActions.setMode.edit());
        }
    };

    const deleteSequence = () => {
        dispatch(EditSequence.delete(sequenceToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const validateInput = (): boolean => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            return DavitUtil.isValidName(sequenceToEdit!.name);
        } else {
            return false;
        }
    };

    const editOrAddSequenceStep = (step?: SequenceStepCTO) => {
        let stepToEdit: SequenceStepCTO | undefined = step;
        if (stepToEdit === undefined) {
            stepToEdit = new SequenceStepCTO();
            stepToEdit.squenceStepTO.sequenceFk = sequenceToEdit?.id || -1;
            stepToEdit.squenceStepTO.root = isFirst();
        }
        dispatch(EditActions.setMode.editStep(stepToEdit));
    };

    const editOrAddDecision = (decision?: DecisionTO) => {
        let decisionToEdit: DecisionTO | undefined = decision;
        if (decisionToEdit === undefined) {
            decisionToEdit = new DecisionTO();
            decisionToEdit.sequenceFk = sequenceToEdit?.id || -1;
            decisionToEdit.root = isFirst();
        }
        dispatch(EditActions.setMode.editDecision(decisionToEdit));
    };

    const isFirst = (): boolean => {
        return selectedSequence?.sequenceStepCTOs.length === 0 && selectedSequence.decisions.length === 0
            ? true
            : false;
    };

    const copySequence = () => {
        const copySequence: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
        copySequence.name = sequenceToEdit?.name + '-copy';
        copySequence.id = -1;
        dispatch(EditSequence.update(copySequence));
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editSequence());
    };

    const updateSequence = () => {
        const copySequence: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
        dispatch(EditSequence.save(copySequence));
    };

    return {
        label: 'EDIT * ' + (sequenceToEdit?.name || ''),
        name: sequenceToEdit?.name,
        changeName,
        saveSequence,
        deleteSequence,
        textInput,
        editOrAddSequenceStep,
        validateInput,
        copySequence,
        createAnother,
        updateSequence,
        editOrAddDecision,
        id: sequenceToEdit?.id || -1,
    };
};
