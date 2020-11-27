import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { DataSetupCTO } from '../../../../../dataAccess/access/cto/DataSetupCTO';
import { SequenceCTO } from '../../../../../dataAccess/access/cto/SequenceCTO';
import { ChainTO } from '../../../../../dataAccess/access/to/ChainTO';
import { DataSetupTO } from '../../../../../dataAccess/access/to/DataSetupTO';
import { SequenceTO } from '../../../../../dataAccess/access/to/SequenceTO';
import { SequenceModelActions, sequenceModelSelectors } from '../../../../../slices/SequenceModelSlice';
import { DavitUtil } from '../../../../../utils/DavitUtil';
import { useStepAndLinkNavigation } from '../../../../../utils/WindowUtil';
import { ChainDropDown } from '../../../../common/fragments/dropdowns/ChainDropDown';
import { DataSetupDropDown } from '../../../../common/fragments/dropdowns/DataSetupDropDown';
import { SequenceDropDown } from '../../../../common/fragments/dropdowns/SequenceDropDown';
import { ControllPanelEditSub } from '../edit/common/ControllPanelEditSub';
import { OptionField } from '../edit/common/OptionField';

export interface ControllPanelViewOptionsProps {
    hidden: boolean;
}

export const ControllPanelViewOptions: FunctionComponent<ControllPanelViewOptionsProps> = (props) => {
    const { hidden } = props;

    const {
        label,
        sequence,
        stepIndex,
        linkIndex,
        selectSequence,
        selectDataSetup,
        currentDataSetup,
        currentSequence,
        currentChain,
        selectChain,
    } = useControllPanelSequenceOptionsViewModel();

    const { stepBack, stepNext, linkBack, linkNext } = useStepAndLinkNavigation();

    const getIndex = (): string => {
        const link: string = (linkIndex + 1).toString() || '0';
        const step: string = stepIndex.toString() || '0';
        const index: string = link + ' / ' + step;
        return index;
    };

    return (
        <ControllPanelEditSub label={label} hidden={hidden}>
            <div className="optionFieldSpacer">
                <OptionField>
                    <OptionField label="Data - Setup">
                        <DataSetupDropDown
                            onSelect={selectDataSetup}
                            placeholder="Select Data Setup ..."
                            value={currentDataSetup}
                        />
                    </OptionField>
                    <OptionField label="SEQUENCE">
                        <SequenceDropDown onSelect={selectSequence} value={currentSequence} />
                    </OptionField>
                </OptionField>
            </div>
            <div className="optionFieldSpacer columnDivider">
                <OptionField label="CHAIN">
                    <ChainDropDown onSelect={selectChain} value={currentChain} />
                </OptionField>
            </div>
            <div className="optionFieldSpacer columnDivider">
                <OptionField label="STEP">
                    <Button.Group inverted color="orange">
                        <Button
                            inverted
                            color="orange"
                            icon="fast backward"
                            disabled={DavitUtil.isNullOrUndefined(sequence)}
                            onClick={linkBack}
                        />
                        <Button
                            inverted
                            color="orange"
                            icon="left arrow"
                            content="BACK"
                            labelPosition="left"
                            disabled={DavitUtil.isNullOrUndefined(sequence)}
                            onClick={stepBack}
                        />
                        <Button inverted color="orange" content={getIndex()} disabled={true} />
                        <Button
                            inverted
                            color="orange"
                            icon="right arrow"
                            content="NEXT"
                            labelPosition="right"
                            disabled={DavitUtil.isNullOrUndefined(sequence)}
                            onClick={stepNext}
                        />
                        <Button
                            inverted
                            color="orange"
                            icon="fast forward"
                            disabled={DavitUtil.isNullOrUndefined(sequence)}
                            onClick={linkNext}
                        />
                    </Button.Group>
                </OptionField>
            </div>
            <div className="optionFieldSpacer columnDivider">
                <OptionField />
            </div>
        </ControllPanelEditSub>
    );
};

const useControllPanelSequenceOptionsViewModel = () => {
    const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
    const selectedDataSetup: DataSetupCTO | null = useSelector(sequenceModelSelectors.selectDataSetup);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const linkIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentLinkIndex);
    const dispatch = useDispatch();

    const selectSequence = (sequence: SequenceTO | undefined) => {
        if (!DavitUtil.isNullOrUndefined(sequence)) {
            dispatch(SequenceModelActions.setCurrentSequence(sequence!.id));
        }
        if (sequence === undefined) {
            dispatch(SequenceModelActions.resetCurrentStepIndex);
            dispatch(SequenceModelActions.resetCurrentSequence);
        }
    };

    const selectChain = (chain: ChainTO | undefined) => {
        if (!DavitUtil.isNullOrUndefined(chain)) {
            dispatch(SequenceModelActions.setCurrentChain(chain!));
        }
        if (chain === undefined) {
            dispatch(SequenceModelActions.resetCurrentStepIndex);
            dispatch(SequenceModelActions.resetCurrentChain);
        }
    };

    const selectDataSetup = (dataSetup: DataSetupTO | undefined): void => {
        if (DavitUtil.isNullOrUndefined(dataSetup)) {
            dispatch(SequenceModelActions.resetCurrentDataSetup);
        } else {
            dispatch(SequenceModelActions.setCurrentDataSetup(dataSetup!.id));
        }
    };

    const getDataSetupName = (): string => {
        if (selectedDataSetup) {
            return ' * ' + selectDataSetup.name;
        } else {
            return '';
        }
    };

    const getSequenceName = (): string => {
        if (sequence) {
            return ' * ' + sequence.sequenceTO.name;
        } else {
            return '';
        }
    };

    const getStepName = (): string => {
        if (stepIndex && sequence) {
            return (
                ' * ' +
                sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === stepIndex)?.squenceStepTO.name
            );
        } else {
            return '';
        }
    };

    return {
        label: 'VIEW' + getDataSetupName() + getSequenceName() + getStepName(),
        sequence,
        stepIndex,
        linkIndex,
        selectSequence,
        selectDataSetup,
        currentDataSetup: selectedDataSetup?.dataSetup.id || -1,
        currentSequence: sequence?.sequenceTO.id || -1,
        currentChain: selectedChain?.id || -1,
        selectChain,
    };
};
