import React, { FunctionComponent } from 'react';
import { useEditConditionViewModel } from '../viewmodels/EditDecisionViewModel';
import { Form } from '../../../../../../common/fragments/forms/Form';
import { DavitLabelTextfield } from '../../../../../../common/fragments/DavitLabelTextfield';
import { GoToOptionDropDown } from '../../../../../../common/fragments/dropdowns/GoToOptionDropDown';
import { GoToTypes } from '../../../../../../../dataAccess/access/types/GoToType';
import { DavitAddButton } from '../../../../../../common/fragments/buttons/DavitAddButton';
import { StepDropDown } from '../../../../../../common/fragments/dropdowns/StepDropDown';
import { DecisionDropDown } from '../../../../../../common/fragments/dropdowns/DecisionDropDown';
import { DavitCommentButton } from '../../../../../../common/fragments/buttons/DavitCommentButton';
import { DavitBackButton } from '../../../../../../common/fragments/buttons/DavitBackButton';
import { DavitRootButton } from '../../../../../../common/fragments/buttons/DavitRootButton';
import { DavitDeleteButton } from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import { FormLine } from './fragments/FormLine';
import { FormLabel, FormlabelAlign } from './fragments/FormLabel';
import { FormDivider } from './fragments/FormDivider';
import { FormHeader } from '../../../../../../common/fragments/forms/FormHeader';
import { FormBody } from '../../../../../../common/fragments/forms/FormBody';
import { FormFooter } from '../../../../../../common/fragments/forms/FormFooter';
import { DavitUtil } from '../../../../../../../utils/DavitUtil';
import { ActorDropDown } from '../../../../../../common/fragments/dropdowns/ActorDropDown';
import { InstanceDropDown } from '../../../../../../common/fragments/dropdowns/InstanceDropDown';
import { ConditionTO } from '../../../../../../../dataAccess/access/to/ConditionTO';

interface DecisionFormProps {

}

export const DecisionForm: FunctionComponent<DecisionFormProps> = () => {

    const {
        name,
        changeName,
        handleType,
        ifGoTo,
        elseGoTo,
        setGoToTypeStep,
        createGoToStep,
        setRoot,
        isRoot,
        deleteDecision,
        createGoToDecision,
        setGoToTypeDecision,
        createCondition,
        decId,
        conditions,
        note,
        saveNote,
        deleteCondition,
        saveCondition,
        saveAndGoBack,
    } = useEditConditionViewModel();


    const labelDecision: string = 'Select next decision';
    const labelCreateDecision: string = 'Create new / next decision';
    const labelStep: string = 'Select next step';
    const labelCreateStep: string = 'Create new /next step';
    const labelTypeIf: string = 'Type condition true';
    const labelTypeElse: string = 'Type condition false';
    const labelIfLabel: string = "If condition's are true";
    const labelElseLabel: string = "If condition's are false";


    const buildConditionTableRow = (condition: ConditionTO): JSX.Element => {
        let copyCondition: ConditionTO = DavitUtil.deepCopy(condition);

        return (
            <tr key={copyCondition.id}>
                <td>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ActorDropDown
                            onSelect={(actor) => {
                                copyCondition.actorFk = actor ? actor.actor.id : -1;
                                saveCondition(copyCondition);
                            }}
                            placeholder={'Select actor...'}
                            value={copyCondition.actorFk}
                        />
                        <InstanceDropDown
                            onSelect={(dataAndInstance) => {
                                if (!DavitUtil.isNullOrUndefined(dataAndInstance)) {
                                    copyCondition.dataFk = dataAndInstance!.dataFk;
                                    copyCondition.instanceFk = dataAndInstance!.instanceId;
                                    saveCondition(copyCondition);
                                }
                            }}
                            placeholder={'Select data instance ...'}
                            value={JSON.stringify({
                                dataFk: copyCondition!.dataFk,
                                instanceId: copyCondition!.instanceFk,
                            })
                            } />
                        {copyCondition.id !== -1 && <DavitDeleteButton onClick={() => {
                            deleteCondition(copyCondition.id);
                        }} noConfirm />}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <Form>
            <FormHeader><h2>Decision</h2></FormHeader>

            <FormDivider />

            <FormBody>

                <FormLine>
                    <DavitLabelTextfield
                        label='Name:'
                        placeholder='Decision name ...'
                        onChangeCallback={(name: string) => changeName(name)}
                        value={name}
                        focus={true}
                    />
                </FormLine>

                {/*------------------------- Condition -------------------------*/}

                <FormLine>
                    <table className={'border'} style={{ width: '40em', minHeight: '30vh' }}>
                        <thead>
                        <tr>
                            <td style={{ textAlign: 'center' }}>Actor</td>
                            <td style={{ textAlign: 'center' }}>Data Instance</td>
                            <td style={{ textAlign: 'end' }}><DavitAddButton onClick={createCondition} /></td>
                        </tr>
                        </thead>
                        <tbody style={{ maxHeight: '40vh' }}>
                        {conditions.map(buildConditionTableRow)}
                        </tbody>
                    </table>
                </FormLine>

                {/*------------------------- If option -------------------------*/}

                <FormDivider />

                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>
                        <h3>{labelIfLabel}</h3>
                    </FormLabel>
                </FormLine>

                <FormLine>
                    <FormLabel>{labelTypeIf}</FormLabel>
                    <GoToOptionDropDown
                        onSelect={(gt) => handleType(true, gt)}
                        value={ifGoTo ? ifGoTo.type : GoToTypes.FIN}
                    />
                </FormLine>

                {ifGoTo!.type === GoToTypes.STEP && (
                    <>
                        <FormLine>
                            <FormLabel>{labelStep}</FormLabel>
                            <StepDropDown
                                onSelect={(step) => setGoToTypeStep(true, step)}
                                value={ifGoTo?.type === GoToTypes.STEP ? ifGoTo.id : 1}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateStep}</FormLabel>
                            <DavitAddButton onClick={() => createGoToStep(true)} />
                        </FormLine>
                    </>
                )}

                {ifGoTo!.type === GoToTypes.DEC && (
                    <>
                        <FormLine>
                            <FormLabel>{labelDecision}</FormLabel>
                            <DecisionDropDown
                                onSelect={(cond) => setGoToTypeDecision(true, cond)}
                                value={ifGoTo?.type === GoToTypes.DEC ? ifGoTo.id : 1}
                                exclude={decId}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateDecision}</FormLabel>
                            <DavitAddButton onClick={() => createGoToDecision(true)} />
                        </FormLine>
                    </>
                )}

                {/*------------------------- Else option -------------------------*/}
                <FormDivider />

                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>
                        <h3>{labelElseLabel}</h3>
                    </FormLabel>
                </FormLine>

                <FormLine>
                    <FormLabel>{labelTypeElse}</FormLabel>
                    <GoToOptionDropDown
                        onSelect={(gt) => handleType(false, gt)}
                        value={elseGoTo ? elseGoTo.type : GoToTypes.ERROR}
                    />
                </FormLine>

                {elseGoTo!.type === GoToTypes.STEP && (
                    <>
                        <FormLine>
                            <FormLabel>{labelStep}</FormLabel>
                            <StepDropDown
                                onSelect={(step) => setGoToTypeStep(false, step)}
                                value={elseGoTo?.type === GoToTypes.STEP ? elseGoTo.id : 1}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateStep}</FormLabel>
                            <DavitAddButton onClick={() => createGoToStep(false)} />
                        </FormLine>
                    </>
                )}

                {elseGoTo!.type === GoToTypes.DEC && (
                    <>
                        <FormLine>
                            <FormLabel>{labelDecision}</FormLabel>
                            <DecisionDropDown
                                onSelect={(cond) => setGoToTypeDecision(false, cond)}
                                value={elseGoTo?.type === GoToTypes.DEC ? elseGoTo.id : 1}
                                exclude={decId}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateDecision}</FormLabel>
                            <DavitAddButton onClick={() => createGoToDecision(false)} />
                        </FormLine>
                    </>
                )}
            </FormBody>
            <FormDivider />
            <FormFooter>
                <DavitDeleteButton onClick={deleteDecision} />
                <DavitCommentButton onSaveCallback={saveNote} comment={note} />
                <DavitRootButton onClick={setRoot} isRoot={isRoot} />
                <DavitBackButton onClick={saveAndGoBack} />
            </FormFooter>

        </Form>
    );
};
