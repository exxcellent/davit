import React, { FunctionComponent } from 'react';
import { ActiveTab } from '../presentation/SequenceTableModelController';
import { TabFragment } from './TabFragment';
import { TabGroupFragment } from './TabGroupFragment';

interface TabPanelProps {
    activeTab: ActiveTab;
    setActiveTab: (newActiveTab: ActiveTab) => void;
    showChainModelTab: boolean;
    showSequenceModelTabs: boolean;
    showCalcChainTab: boolean;
    showCalcSequenceTab: boolean;
}

interface TabGroupDefinition {
    label: string;
    tabs: TabDefinition[];
    condition?: boolean;
}
interface TabDefinition {
    label: string;
    identifier: ActiveTab;
    condition?: boolean;
}

export const TabPanel: FunctionComponent<TabPanelProps> = (props) => {
    const {
        activeTab,
        setActiveTab,
        showCalcChainTab,
        showCalcSequenceTab,
        showChainModelTab,
        showSequenceModelTabs,
    } = props;

    const tabDefinitions: TabGroupDefinition[] = [
        {
            label: 'Calculated',
            condition: showCalcChainTab || showCalcSequenceTab,
            tabs: [
                {
                    label: 'Chain',
                    identifier: ActiveTab.chain,
                    condition: showCalcChainTab,
                },
                {
                    label: 'Sequence',
                    identifier: ActiveTab.sequence,
                    condition: showCalcSequenceTab,
                },
            ],
        },
        {
            label: 'Chain Model',
            condition: showChainModelTab,
            tabs: [
                {
                    label: 'Decision',
                    identifier: ActiveTab.chaindecisions,
                },
                {
                    label: 'Links',
                    identifier: ActiveTab.chainlinks,
                },
            ],
        },
        {
            label: 'Sequence Model',
            condition: showSequenceModelTabs,
            tabs: [
                {
                    label: 'Decision',
                    identifier: ActiveTab.decision,
                },
                {
                    label: 'Steps',
                    identifier: ActiveTab.step,
                },
            ],
        },
        {
            label: 'Models',
            tabs: [
                {
                    label: 'Chain',
                    identifier: ActiveTab.chainModel,
                },
                {
                    label: 'Sequence',
                    identifier: ActiveTab.sequenceModels,
                },
                {
                    label: 'Data Setup',
                    identifier: ActiveTab.dataSetup,
                },
            ],
        },
    ];

    const mapTabGroups = (tabGroup: TabGroupDefinition, key: number) => {
        return (
            (tabGroup.condition === undefined || tabGroup.condition) && (
                <TabGroupFragment label={tabGroup.label} key={key}>
                    {tabGroup.tabs.map(
                        (tab: any, index) =>
                            (tab.condition === undefined || tab.condition) && (
                                <TabFragment
                                    label={tab.label}
                                    isActive={activeTab === tab.identifier}
                                    onClick={() => setActiveTab(tab.identifier)}
                                    key={index}
                                />
                            ),
                    )}
                </TabGroupFragment>
            )
        );
    };

    const getTabsKey = () => {
        let key = showCalcChainTab ? 'chain' : '';
        key += showSequenceModelTabs ? 'seqModel' : '';
        key += showChainModelTab ? 'chainModel' : '';
        key += showCalcSequenceTab ? 'seq' : '';
        return key;
    };

    return (
        <div className="tabs" key={getTabsKey()}>
            {tabDefinitions.map(mapTabGroups)}
        </div>
    );
};
