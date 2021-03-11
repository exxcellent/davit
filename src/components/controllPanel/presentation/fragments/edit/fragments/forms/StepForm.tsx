import React, { FunctionComponent } from 'react';
import { DavitLabelTextfield } from '../../../../../../common/fragments/DavitLabelTextfield';
import { DavitCommentButton } from '../../../../../../common/fragments/buttons/DavitCommentButton';
import { DavitBackButton } from '../../../../../../common/fragments/buttons/DavitBackButton';
import { DavitDeleteButton } from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import { FormLine } from './fragments/FormLine';
import { Form } from '../../../../../../common/fragments/forms/Form';
import { FormDivider } from './fragments/FormDivider';
import { AddOrEdit } from '../../../../../../common/fragments/AddOrEdit';
import { ActionButtonDropDown } from '../../../../../../common/fragments/dropdowns/ActionButtonDropDown';
import { GoToOptionDropDown } from '../../../../../../common/fragments/dropdowns/GoToOptionDropDown';
import { GoToTypes } from '../../../../../../../dataAccess/access/types/GoToType';
import { DavitAddButton } from '../../../../../../common/fragments/buttons/DavitAddButton';
import { StepDropDown } from '../../../../../../common/fragments/dropdowns/StepDropDown';
import { DecisionDropDown } from '../../../../../../common/fragments/dropdowns/DecisionDropDown';
import { DavitRootButton } from '../../../../../../common/fragments/buttons/DavitRootButton';
import { useStepViewModel } from '../viewmodels/EditStepViewModel';
import { FormLabel } from './fragments/FormLabel';

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
    } = useStepViewModel();

    const labelSelectDecision: string = 'Select next decision';
    const labelCreateDecision: string = 'Create next decision';
    const labelSelectStep: string = 'Select next step';
    const labelCreateStep: string = 'Create next step';

    return (
        <Form>
            <FormLine>
                <h2>Step</h2>
            </FormLine>

            <FormDivider />

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
            </FormLine>

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

            <FormDivider />

            <FormLine>
                <DavitDeleteButton onClick={deleteSequenceStep} />
                <DavitCommentButton onSaveCallback={saveNote} comment={note} />
                <DavitRootButton onClick={setRoot} isRoot={isRoot} />
                <DavitBackButton onClick={saveSequenceStep} />
            </FormLine>
        </Form>
    );
};
