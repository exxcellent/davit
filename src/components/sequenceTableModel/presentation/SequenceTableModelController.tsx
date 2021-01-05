/* eslint-disable react/display-name */
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChainlinkCTO } from '../../../dataAccess/access/cto/ChainlinkCTO';
import { SequenceCTO } from '../../../dataAccess/access/cto/SequenceCTO';
import { SequenceStepCTO } from '../../../dataAccess/access/cto/SequenceStepCTO';
import { ChainDecisionTO } from '../../../dataAccess/access/to/ChainDecisionTO';
import { ChainTO } from '../../../dataAccess/access/to/ChainTO';
import { DataSetupTO } from '../../../dataAccess/access/to/DataSetupTO';
import { SequenceTO } from '../../../dataAccess/access/to/SequenceTO';
import { CalcChain } from '../../../services/SequenceChainService';
import { CalculatedStep } from '../../../services/SequenceService';
import { editSelectors, Mode } from '../../../slices/EditSlice';
import { masterDataSelectors } from '../../../slices/MasterDataSlice';
import { sequenceModelSelectors } from '../../../slices/SequenceModelSlice';
import { DavitUtil } from '../../../utils/DavitUtil';
import { DavitTable } from '../../common/fragments/DavitTable';
import { TabPanel } from '../fragments/TabPanel';
import { useGetCalcLinkTableData } from '../tables/CalcLink';
import { useGetCalcSequenceTableData } from '../tables/CalcSequence';
import { useGetDataSetupTableData } from '../tables/DataSetup';
import { useGetChainModelsTableData } from '../tables/ModelChain';
import { useGetModelChainDecisionTableData } from '../tables/ModelChainDecision';
import { useGetModelChainLinkTableData } from '../tables/ModelChainLink';
import { useGetSequenceModelsTableBody } from '../tables/ModelSequence';
import { useGetModelSequenceDecisionTableData } from '../tables/ModelSequenceDecision';
import { useGetStepTableData } from '../tables/ModelSequenceStep';
import { useGetStepActionTableData } from '../tables/ModelSequenceStepAction';

interface SequenceTableModelControllerProps {
    fullScreen?: boolean;
}

export enum ActiveTab {
    action = 'action',
    step = 'step',
    decision = 'decision',
    sequence = 'sequence',
    chain = 'chain',
    chainlinks = 'chainlinks',
    chaindecisions = 'chaindecisions',
    sequenceModels = 'sequenceModels',
    chainModel = 'chainModels',
    dataSetup = 'dataSetup',
}

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = (props) => {
    const { fullScreen } = props;
    const {
        showChainModelTab,
        showSequenceModelTabs,
        showCalcChainTab,
        showCalcSequenceTab,

        activeTab,
        setActiveTab,

        activeTableData,

        tableHeight,
        parentRef,
    } = useSequenceTableViewModel();

    return (
        <div className={fullScreen ? '' : 'sequenceTable'} ref={parentRef}>
            <div className="tableBorder">
                <TabPanel
                    showChainModelTab={showChainModelTab}
                    showSequenceModelTabs={showSequenceModelTabs}
                    showCalcChainTab={showCalcChainTab}
                    showCalcSequenceTab={showCalcSequenceTab}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <DavitTable {...activeTableData} tableHeight={tableHeight} />
            </div>
        </div>
    );
};

const useSequenceTableViewModel = () => {
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
    const calcSteps: CalculatedStep[] = useSelector(sequenceModelSelectors.selectCalcSteps);
    const calcChain: CalcChain | null = useSelector(sequenceModelSelectors.selectCalcChain);
    const sequences: SequenceTO[] = useSelector(masterDataSelectors.sequences);
    const dataSetups: DataSetupTO[] = useSelector(masterDataSelectors.dataSetup);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const chainModels: ChainTO[] = useSelector(masterDataSelectors.chains);
    const mode: Mode = useSelector(editSelectors.mode);
    const selectedChainlinks: ChainlinkCTO[] = useSelector(sequenceModelSelectors.selectCurrentChainLinks);
    const selectedChainDecisions: ChainDecisionTO[] = useSelector(sequenceModelSelectors.selectCurrentChainDecisions);

    const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.sequence);

    useEffect(() => {
        let newActiveTab: ActiveTab | undefined = undefined;
        switch (mode) {
            case Mode.VIEW:
                if (selectedChain) {
                    newActiveTab = ActiveTab.chain;
                } else {
                    newActiveTab = ActiveTab.sequence;
                }
                break;
            case Mode.EDIT_CHAIN:
                newActiveTab = ActiveTab.chainModel;
                break;
            case Mode.EDIT_CHAIN_DECISION:
            case Mode.EDIT_CHAIN_DECISION_CONDITION:
                newActiveTab = ActiveTab.chaindecisions;
                break;
            case Mode.EDIT_SEQUENCE:
                newActiveTab = ActiveTab.sequenceModels;
                break;
            case Mode.EDIT_SEQUENCE_DECISION:
            case Mode.EDIT_SEQUENCE_DECISION_CONDITION:
                newActiveTab = ActiveTab.decision;
                break;
            case Mode.EDIT_SEQUENCE_STEP:
                newActiveTab = ActiveTab.step;
                break;
            case Mode.EDIT_SEQUENCE_STEP_ACTION:
                newActiveTab = ActiveTab.action;
                break;
        }
        if (newActiveTab) {
            setActiveTab(newActiveTab);
        }
    }, [mode, selectedChain]);

    const dataSetupData = useGetDataSetupTableData(dataSetups);
    const modelSequenceData = useGetSequenceModelsTableBody(sequences);
    const modelSequenceDecisionData = useGetModelSequenceDecisionTableData(selectedSequence);
    const modelSequenceStepData = useGetStepTableData(selectedSequence);
    const modelStepActionData = useGetStepActionTableData(stepToEdit);
    const modelChainData = useGetChainModelsTableData(chainModels);
    const modelChainDecisionData = useGetModelChainDecisionTableData(
        calcChain,
        selectedChainlinks,
        selectedChainDecisions,
    );
    const modelChainLinkData = useGetModelChainLinkTableData(selectedChainlinks, selectedChainDecisions);
    const calcSequenceData = useGetCalcSequenceTableData(calcSteps, selectedSequence);
    const calcLinkData = useGetCalcLinkTableData(calcChain);

    const getActiveTableData = () => {
        switch (activeTab) {
            case ActiveTab.chain:
                return calcLinkData;
            case ActiveTab.chaindecisions:
                return modelChainDecisionData;
            case ActiveTab.chainlinks:
                return modelChainLinkData;
            case ActiveTab.action:
                return modelStepActionData;
            case ActiveTab.step:
                return modelSequenceStepData;
            case ActiveTab.decision:
                return modelSequenceDecisionData;
            case ActiveTab.sequence:
                return calcSequenceData;
            case ActiveTab.sequenceModels:
                return modelSequenceData;
            case ActiveTab.chainModel:
                return modelChainData;
            case ActiveTab.dataSetup:
                return dataSetupData;
            default:
                return { header: [], bodyData: [] };
        }
    };

    const parentRef = useRef<HTMLDivElement>(null);

    const [tableHeight, setTabelHeihgt] = useState<number>(0);

    useEffect(() => {
        const resizeListener = () => {
            if (parentRef && parentRef.current) {
                setTabelHeihgt(parentRef.current.offsetHeight - 120);
            }
        };

        resizeListener();
        window.addEventListener('resize', resizeListener);

        return () => {
            window.removeEventListener('resize', resizeListener);
        };
    }, [parentRef]);

    return {
        showChainModelTab: !DavitUtil.isNullOrUndefined(selectedChain),
        showSequenceModelTabs: !DavitUtil.isNullOrUndefined(selectedSequence),
        showCalcChainTab: !DavitUtil.isNullOrUndefined(calcChain),
        showCalcSequenceTab: calcSteps.length > 0,
        activeTab,
        setActiveTab,

        activeTableData: getActiveTableData(),
        tableHeight,
        parentRef,
    };
};
