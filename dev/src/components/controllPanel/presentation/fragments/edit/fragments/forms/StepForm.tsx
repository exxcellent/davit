import React, { FunctionComponent, useState } from 'react';
import { DavitLabelTextfield } from '../../../../../../common/fragments/DavitLabelTextfield';
import { DavitCommentButton } from '../../../../../../common/fragments/buttons/DavitCommentButton';
import { DavitBackButton } from '../../../../../../common/fragments/buttons/DavitBackButton';
import { DavitDeleteButton } from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import { FormLine } from './fragments/FormLine';
import { Form } from '../../../../../../common/fragments/forms/Form';
import { FormDivider } from './fragments/FormDivider';
import { useActionDropDownViewModel } from '../../../../../../common/fragments/dropdowns/ActionButtonDropDown';
import { GoToOptionDropDown } from '../../../../../../common/fragments/dropdowns/GoToOptionDropDown';
import { GoToTypes } from '../../../../../../../dataAccess/access/types/GoToType';
import { DavitAddButton } from '../../../../../../common/fragments/buttons/DavitAddButton';
import { StepDropDown } from '../../../../../../common/fragments/dropdowns/StepDropDown';
import { DecisionDropDown } from '../../../../../../common/fragments/dropdowns/DecisionDropDown';
import { DavitRootButton } from '../../../../../../common/fragments/buttons/DavitRootButton';
import { useStepViewModel } from '../viewmodels/StepViewModel';
import { FormLabel } from './fragments/FormLabel';
import { DavitShowMoreButton } from '../../../../../../common/fragments/buttons/DavitShowMoreButton';
import { ActionTO } from '../../../../../../../dataAccess/access/to/ActionTO';
import { DavitButton } from '../../../../../../common/fragments/buttons/DavitButton';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';
import { DavitEditButton } from '../../../../../../common/fragments/buttons/DavitEditButton';
import { useActionViewModel } from '../viewmodels/ActionViewModel';
import { FormHeader } from '../../../../../../common/fragments/forms/FormHeader';
import { FormBody } from '../../../../../../common/fragments/forms/FormBody';
import { FormFooter } from '../../../../../../common/fragments/forms/FormFooter';

interface StepFormProps {
}

export const StepForm: FunctionComponent<StepFormProps> = () => {

    const {
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
        stepId,
        note,
        saveNote,
        actions,
        switchIndexesAndSave,
    } = useStepViewModel();

    const {deleteAction} = useActionViewModel();

    const { getOptionText } = useActionDropDownViewModel();

    const labelSelectDecision: string = 'Select next decision';
    const labelCreateDecision: string = 'Create next decision';
    const labelSelectStep: string = 'Select next step';
    const labelCreateStep: string = 'Create next step';

    const [showActions, setShowActions] = useState(true);

    const createActionRow = (action: ActionTO, index: number): JSX.Element => {
        return (<tr key={index}>
                <td>
                    <label>{getOptionText(action)}</label>
                </td>
                <td style={{ textAlign: 'end' }}>
                    <DavitDeleteButton onClick={() => {
                        deleteAction(action);
                        updateStep();
                    }} />
                    <DavitEditButton onClick={() => editOrAddAction(action)} />
                    <DavitButton iconName={faAngleDown} onClick={() => switchIndexesAndSave(index, true)} />
                    <DavitButton iconName={faAngleUp} onClick={() => switchIndexesAndSave(index, false)} />
                </td>
            </tr>
        );
    };

    const buildActionTable = (actions: ActionTO[]): JSX.Element => {
        return (
            <table className={'border'} style={{ width: '40em', overflow: 'hidden' }}>
                <thead>
                <tr>
                    <td style={{ textAlign: 'center' }}>Action</td>
                    <td style={{ textAlign: 'end' }}>
                        <DavitAddButton onClick={() => {
                            editOrAddAction();
                            updateStep();
                        }} />
                    </td>
                </tr>
                </thead>
                <tbody style={{ maxHeight: '30vh' }}>
                {actions.map((action, index) => createActionRow(action, index))}
                </tbody>
            </table>
        );
    };

    return (
        <Form>
            <FormHeader>
                <h2>Step</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

            <FormLine>
                <DavitLabelTextfield
                    label='Name:'
                    placeholder='Step Name ...'
                    onChangeCallback={(name: string) => changeName(name)}
                    value={name}
                    focus={true}
                    onBlur={updateStep}
                />
            </FormLine>

            <FormDivider />

            <FormLine>
                <FormLabel><h3>Actions</h3></FormLabel>
                <DavitShowMoreButton show={showActions} onClick={() => setShowActions(!showActions)} />
            </FormLine>

            {showActions && <FormDivider /> && <FormLine>{buildActionTable(actions)}</FormLine>}

            <FormDivider />

            <FormLine>
                <FormLabel>Select type of the next element</FormLabel>
            </FormLine>

            <FormLine>
                <GoToOptionDropDown onSelect={handleType} value={goTo ? goTo.type : GoToTypes.ERROR} />
            </FormLine>

            {goTo!.type === GoToTypes.STEP && (
                <>
                    <FormDivider />

                    <FormLine>
                        <FormLabel>{labelSelectStep}</FormLabel>
                        <StepDropDown
                            onSelect={setGoToTypeStep}
                            value={goTo?.type === GoToTypes.STEP ? goTo.id : 1}
                            exclude={stepId}
                        />
                    </FormLine>
                    <FormLine>
                        <FormLabel>{labelCreateStep}</FormLabel>
                        <DavitAddButton onClick={createGoToStep} />
                    </FormLine>
                </>
            )}

            {goTo!.type === GoToTypes.DEC && (
                <>
                    <FormDivider />

                    <FormLine>
                        <FormLabel>{labelSelectDecision}</FormLabel>
                        <DecisionDropDown
                            onSelect={setGoToTypeDecision}
                            value={goTo?.type === GoToTypes.DEC ? goTo.id : 1}
                        />
                    </FormLine>
                    <FormLine>
                        <FormLabel>{labelCreateDecision}</FormLabel>
                        <DavitAddButton onClick={createGoToDecision} />
                    </FormLine>
                </>
            )}
            </FormBody>

            <FormDivider />

            <FormFooter>
                <DavitDeleteButton onClick={deleteSequenceStep} />
                <DavitCommentButton onSaveCallback={saveNote} comment={note} />
                <DavitRootButton onClick={setRoot} isRoot={isRoot} />
                <DavitBackButton onClick={saveSequenceStep} />
            </FormFooter>
        </Form>
    );
};
