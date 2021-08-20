import React, { FunctionComponent, useState } from "react";
import { FlowChartlabel } from "../../../../../../../domains/overview/flowChartModel/fragments/FlowChartlabel";
import { useStepAndLinkNavigation } from "../../../../../../../utils/WindowUtil";
import { DavitButton } from "../../../../../../atomic";
import { NoteIcon } from "../../../../../../atomic/icons/NoteIcon";
import { ControlPanel } from "../../edit/common/ControlPanel";
import { OptionField } from "../../edit/common/OptionField";
import { useViewViewModel } from "../viewmodels/ViewViewModel";
import "./ControlPanelCalculationView.css";
import { ViewNavigator } from "./ViewNavigator";

export interface ControlPanelViewProps {

}

export const ControlPanelCalculationView: FunctionComponent<ControlPanelViewProps> = () => {

    const {
        stepIndex,
        linkIndex,
        selectedChainName,
        selectedSequenceName,
        getSequenceNote,
        getChainNote,
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
                    {selectedChainName !== "" && (
                        <div className="flex-column">
                            <DavitButton onClick={() => setShowChain(true)}
                                         active={showChain}
                            >Show</DavitButton>
                            <DavitButton onClick={() => setShowChain(false)}
                                         active={!showChain}
                            >Show</DavitButton>
                        </div>
                    )}
                </OptionField>

                <OptionField>
                    {/*------ note -----*/}
                    <NoteIcon size="2x"
                              className="margin-medium padding-small border border-medium"
                    />
                    <textarea className="noteTextarea border border-medium padding-medium width-fluid"
                              value={showChain ? getChainNote() : getSequenceNote()}
                              readOnly
                    />

                </OptionField>

                <OptionField>

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
