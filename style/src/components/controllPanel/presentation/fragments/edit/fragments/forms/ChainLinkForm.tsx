import React, {FunctionComponent} from 'react';
import {Form} from '../../../../../../common/fragments/forms/Form';
import {FormHeader} from '../../../../../../common/fragments/forms/FormHeader';
import {FormDivider} from './fragments/FormDivider';
import {FormBody} from '../../../../../../common/fragments/forms/FormBody';
import {FormLine} from './fragments/FormLine';
import {DavitLabelTextfield} from '../../../../../../common/fragments/DavitLabelTextfield';
import {DavitDeleteButton} from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import {DavitBackButton} from '../../../../../../common/fragments/buttons/DavitBackButton';
import {useChainLinkViewModel} from '../viewmodels/ChainLinkViewModel';
import {DataSetupDropDown} from '../../../../../../common/fragments/dropdowns/DataSetupDropDown';
import {FormLabel} from './fragments/FormLabel';
import {FormFooter} from '../../../../../../common/fragments/forms/FormFooter';
import {DavitRootButton} from '../../../../../../common/fragments/buttons/DavitRootButton';
import {SequenceDropDown} from '../../../../../../common/fragments/dropdowns/SequenceDropDown';
import {GoToTypesChain} from '../../../../../../../dataAccess/access/types/GoToTypeChain';
import {GoToChainOptionDropDown} from '../../../../../../common/fragments/dropdowns/GoToChainOptionDropDown';
import {DavitAddButton} from '../../../../../../common/fragments/buttons/DavitAddButton';
import {ChainLinkDropDown} from '../../../../../../common/fragments/dropdowns/ChainLinkDropDown';
import {ChainDecisionDropDown} from '../../../../../../common/fragments/dropdowns/ChainDecisionDropDown';

interface ChainLinkFormProps {
}

export const ChainLinkForm: FunctionComponent<ChainLinkFormProps> = () => {

    const {
        name,
        createGoToDecision,
        changeName,
        chainId,
        createNewChainLink,
        currentDataSetup,
        currentSequence,
        deleteChainLink,
        goTo,
        handleType,
        isRoot,
        linkId,
        saveChainLink,
        setDataSetup,
        setNextDecision,
        setNextLink,
        setRoot,
        setSequenceModel,
    } = useChainLinkViewModel();

    const labelDataSetup: string = 'Select data-setup';
    const labelSequence: string = 'Select sequence';
    const labelGoToType: string = 'Select type of the next';
    const labelSelectLink: string = 'Select next link';
    const labelCreateLink: string = 'Create next link';
    const labelSelectDecision: string = 'Select next decision';
    const labelCreateDecision: string = 'Create next decision';

    return (
        <Form>
            <FormHeader>
                <h2>Chain link</h2>
            </FormHeader>

            <FormDivider/>

            <FormBody>

                <FormLine>
                    <DavitLabelTextfield
                        label='Name:'
                        placeholder='Chainlink Name ...'
                        onChangeCallback={(name: string) => changeName(name)}
                        value={name}
                        focus={true}
                    />
                </FormLine>

                <FormDivider/>

                <FormLine>
                    <FormLabel>{labelDataSetup}</FormLabel>
                    <DataSetupDropDown
                        onSelect={(dataSetup) => setDataSetup(dataSetup)}
                        placeholder='Select Data Setup ...'
                        value={currentDataSetup}
                    />
                </FormLine>

                <FormDivider/>

                <FormLine>
                    <FormLabel>{labelSequence}</FormLabel>
                    <SequenceDropDown
                        onSelect={(seqModel) => setSequenceModel(seqModel)}
                        value={currentSequence}
                    />
                </FormLine>

                <FormDivider/>

                <FormLine>
                    <FormLabel>{labelGoToType}</FormLabel>
                    <GoToChainOptionDropDown
                        onSelect={handleType}
                        value={goTo ? goTo.type : GoToTypesChain.ERROR}
                    />
                </FormLine>

                {goTo.type === GoToTypesChain.LINK && (
                    <>
                        <FormDivider/>

                        <FormLine>
                            <FormLabel>{labelSelectLink}</FormLabel>
                            <DavitAddButton onClick={createNewChainLink}/>
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateLink}</FormLabel>
                            <ChainLinkDropDown
                                onSelect={setNextLink}
                                value={goTo?.type === GoToTypesChain.LINK ? goTo.id : 1}
                                chainId={chainId}
                                exclude={linkId}
                            />
                        </FormLine>
                    </>
                )}
                {goTo.type === GoToTypesChain.DEC && (
                    <>
                        <FormDivider/>

                        <FormLine>
                            <FormLabel>{labelSelectDecision}</FormLabel>
                            <DavitAddButton onClick={createGoToDecision}/>
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateDecision}</FormLabel>
                            <ChainDecisionDropDown
                                onSelect={(cond) => setNextDecision(cond)}
                                value={goTo?.type === GoToTypesChain.DEC ? goTo.id : 1}
                                chainId={chainId}
                            />
                        </FormLine>
                    </>
                )}

            </FormBody>

            <FormDivider/>

            <FormFooter>
                <DavitDeleteButton onClick={deleteChainLink} disable={isRoot}/>
                <DavitRootButton onClick={setRoot} isRoot={isRoot}/>
                <DavitBackButton onClick={saveChainLink}/>
            </FormFooter>


        </Form>
    );
};
