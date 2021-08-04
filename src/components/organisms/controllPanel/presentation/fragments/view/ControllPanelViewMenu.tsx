import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { ChainTO } from "../../../../../../dataAccess/access/to/ChainTO";
import { SequenceTO } from "../../../../../../dataAccess/access/to/SequenceTO";
import { FlowChartlabel } from "../../../../../../domains/overview/flowChartModel/fragments/FlowChartlabel";
import { EditActions } from "../../../../../../slices/EditSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { DavitUtil } from "../../../../../../utils/DavitUtil";
import { useStepAndLinkNavigation } from "../../../../../../utils/WindowUtil";
import { DavitButton } from "../../../../../atomic";
import { ControlPanel } from "../edit/common/ControlPanel";
import { OptionField } from "../edit/common/OptionField";
import { ViewNavigator } from "./fragments/ViewNavigator";

export interface ControlPanelViewMenuProps {
    hidden: boolean;
}

export const ControlPanelViewMenu: FunctionComponent<ControlPanelViewMenuProps> = () => {

    const {
        stepIndex,
        linkIndex,
        selectedChainName,
        selectedSequenceName,
        editConfiguration,
    } = useControlPanelViewMenuViewModel();

    const {stepBack, stepNext, linkBack, linkNext} = useStepAndLinkNavigation();

    const getIndex = (): string => {
        const link: string = (linkIndex + 1).toString() || "0";
        const step: string = stepIndex.toString() || "0";
        return link + " / " + step;
    };

    return (
        <ControlPanel>

            <OptionField label="Configuration">
                <DavitButton onClick={editConfiguration}>Configuration</DavitButton>
            </OptionField>

            <OptionField />
            <OptionField>
                <div style={{marginLeft: "auto"}}>
                    <FlowChartlabel label="CHAIN:"
                                    text={selectedChainName}
                    />
                    <FlowChartlabel label="SEQU.:"
                                    text={selectedSequenceName}
                    />
                </div>
            </OptionField>

            <OptionField label="STEP"
                         divider={false}
            >
                <ViewNavigator fastBackward={linkBack}
                               fastForward={linkNext}
                               backward={stepBack}
                               forward={stepNext}
                               index={getIndex()}
                />
            </OptionField>
        </ControlPanel>
    );
};

const useControlPanelViewMenuViewModel = () => {
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const linkIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentLinkIndex);
    const dispatch = useDispatch();

    const selectSequence = (sequence: SequenceTO | undefined) => {
        if (!DavitUtil.isNullOrUndefined(sequence)) {
            dispatch(SequenceModelActions.setCurrentSequenceById(sequence!.id));
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

    return {
        sequence: selectedSequence,
        stepIndex,
        linkIndex,
        selectSequence,
        currentSequence: selectedSequence?.sequenceTO.id || -1,
        currentChain: selectedChain?.id || -1,
        selectChain,
        selectedSequenceName: selectedSequence?.sequenceTO.name || "",
        selectedChainName: selectedChain?.name || "",
        editConfiguration: () => dispatch(EditActions.setMode.editConfiguration())
    };
};
