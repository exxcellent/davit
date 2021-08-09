import React, { FunctionComponent, useState } from "react";
import { FlowChartlabel } from "../../../../../../../domains/overview/flowChartModel/fragments/FlowChartlabel";
import { useStepAndLinkNavigation } from "../../../../../../../utils/WindowUtil";
import { StateView } from "../../../../../../molecules/StateView";
import { ControlPanel } from "../../edit/common/ControlPanel";
import { OptionField } from "../../edit/common/OptionField";
import { useViewViewModel } from "../viewmodels/ViewViewModel";
import "./ControlPanelView.css";
import { ViewNavigator } from "./ViewNavigator";

export interface ControlPanelViewProps {

}

export const ControlPanelView: FunctionComponent<ControlPanelViewProps> = () => {

    const {
        stepIndex,
        linkIndex,
        selectedChainName,
        selectedSequenceName,
    } = useViewViewModel();

    const {stepBack, stepNext, linkBack, linkNext} = useStepAndLinkNavigation();

    const [showChain, setShowChain] = useState<boolean>(false);


    const getIndex = (): string => {
        const link: string = (linkIndex + 1).toString() || "0";
        const step: string = stepIndex.toString() || "0";
        return link + " / " + step;
    };

    return (
        <>
            <ControlPanel>
                <OptionField>
                    <div>
                        {selectedChainName !== "" && <FlowChartlabel label="CHAIN:"
                                                                     text={selectedChainName}
                        />}
                        <FlowChartlabel label="SEQU.:"
                                        text={selectedSequenceName}
                        />
                    </div>
                </OptionField>

                <OptionField>
                    {/*    States*/}
                    <StateView showChain={showChain} />

                </OptionField>

                <OptionField>
                    {/*    Notes*/}

                </OptionField>

            </ControlPanel>
            <div className="viewNavigatorWrapper">
                <div className="animator">
                    <ViewNavigator fastBackward={linkBack}
                                   fastForward={linkNext}
                                   backward={stepBack}
                                   forward={stepNext}
                                   index={getIndex()}
                    />
                </div>
            </div>
        </>
    );
};
