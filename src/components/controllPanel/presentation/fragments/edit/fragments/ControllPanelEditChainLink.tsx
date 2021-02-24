import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ChainDecisionTO} from "../../../../../../dataAccess/access/to/ChainDecisionTO";
import {ChainlinkTO} from "../../../../../../dataAccess/access/to/ChainlinkTO";
import {ChainTO} from "../../../../../../dataAccess/access/to/ChainTO";
import {DataSetupTO} from "../../../../../../dataAccess/access/to/DataSetupTO";
import {SequenceTO} from "../../../../../../dataAccess/access/to/SequenceTO";
import {GoToChain, GoToTypesChain} from "../../../../../../dataAccess/access/types/GoToTypeChain";
import {EditActions, editSelectors} from "../../../../../../slices/EditSlice";
import {handleError} from "../../../../../../slices/GlobalSlice";
import {sequenceModelSelectors} from "../../../../../../slices/SequenceModelSlice";
import {EditChainLink} from "../../../../../../slices/thunks/ChainLinkThunks";
import {EditChain} from "../../../../../../slices/thunks/ChainThunks";
import {DavitUtil} from "../../../../../../utils/DavitUtil";
import {DavitAddButton} from "../../../../../common/fragments/buttons/DavitAddButton";
import {DavitBackButton} from "../../../../../common/fragments/buttons/DavitBackButton";
import {DavitDeleteButton} from "../../../../../common/fragments/buttons/DavitDeleteButton";
import {DavitRootButton} from "../../../../../common/fragments/buttons/DavitRootButton";
import {DavitLabelTextfield} from "../../../../../common/fragments/DavitLabelTextfield";
import {ChainDecisionDropDown} from "../../../../../common/fragments/dropdowns/ChainDecisionDropDown";
import {ChainLinkDropDown} from "../../../../../common/fragments/dropdowns/ChainLinkDropDown";
import {DataSetupDropDown} from "../../../../../common/fragments/dropdowns/DataSetupDropDown";
import {GoToChainOptionDropDown} from "../../../../../common/fragments/dropdowns/GoToChainOptionDropDown";
import {SequenceDropDown} from "../../../../../common/fragments/dropdowns/SequenceDropDown";
import {ControllPanelEditSub} from "../common/ControllPanelEditSub";
import {OptionField} from "../common/OptionField";

export interface ControllPanelEditChainLinkProps {
    hidden: boolean;
}

export const ControllPanelEditChainLink: FunctionComponent<ControllPanelEditChainLinkProps> = (props) => {
    const { hidden } = props;
    const {
        label,
        name,
        changeName,
        textInput,
        goTo,
        isRoot,
        currentDataSetup,
        currentSequence,
        deleteChainLink,
        saveChainLink,
        setDataSetup,
        setSequenceModel,
        linkId,
        chainId,
        handleType,
        setNextLink,
        setNextDecision,
        createNewChainLink,
        createGoToDecision,
        setRoot,
        id,
    } = useControllPanelEditChainStepViewModel();

    return (
        <ControllPanelEditSub key={id} label={label} hidden={hidden} onClickNavItem={saveChainLink}>
            <div className="optionFieldSpacer">
                <OptionField label="Chainlink - name">
                    <DavitLabelTextfield
                        label="Name:"
                        placeholder="Chainlink Name ..."
                        onChangeDebounced={(name: string) => changeName(name)}
                        value={name}
                        ref={textInput}
                    />
                </OptionField>
            </div>
            <div className="optionFieldSpacer columnDivider">
                <OptionField>
                    <OptionField label="Select Data Setup">
                        <DataSetupDropDown
                            onSelect={(dataSetup) => setDataSetup(dataSetup)}
                            placeholder="Select Data Setup ..."
                            value={currentDataSetup}
                        />
                    </OptionField>
                    <OptionField label="Select Sequence">
                        <SequenceDropDown onSelect={(seqModel) => setSequenceModel(seqModel)} value={currentSequence} />
                    </OptionField>
                </OptionField>
            </div>
            <div className="optionFieldSpacer columnDivider">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <OptionField label="Select type of the next">
                        <GoToChainOptionDropDown
                            onSelect={handleType}
                            value={goTo ? goTo.type : GoToTypesChain.ERROR}
                        />
                    </OptionField>
                    {goTo!.type === GoToTypesChain.LINK && (
                        <OptionField label="Create or Select next link">
                            <DavitAddButton onClick={createNewChainLink} />
                            <ChainLinkDropDown
                                onSelect={setNextLink}
                                value={goTo?.type === GoToTypesChain.LINK ? goTo.id : 1}
                                chainId={chainId}
                                exclude={linkId}
                            />
                        </OptionField>
                    )}

                    {goTo!.type === GoToTypesChain.DEC && (
                        <OptionField label="Create or Select next decision">
                            <DavitAddButton onClick={createGoToDecision} />
                            <ChainDecisionDropDown
                                onSelect={(cond) => setNextDecision(cond)}
                                value={goTo?.type === GoToTypesChain.DEC ? goTo.id : 1}
                                chainId={chainId}
                            />
                        </OptionField>
                    )}
                </div>
            </div>
            <div className="columnDivider controllPanelEditChild">
                <div>
                    <OptionField label="Navigation">
                        <DavitBackButton onClick={saveChainLink} />
                    </OptionField>
                </div>
                <div className="controllPanelEditChild">
                    <div>
                        <OptionField label="Sequence - Options">
                            <DavitRootButton onClick={setRoot} isRoot={isRoot} />
                            <div>
                                <DavitDeleteButton onClick={deleteChainLink} disable={isRoot} />
                            </div>
                        </OptionField>
                    </div>
                </div>
            </div>
        </ControllPanelEditSub>
    );
};

const useControllPanelEditChainStepViewModel = () => {
    const chainLinkToEdit: ChainlinkTO | null = useSelector(editSelectors.selectChainLinkToEdit);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const dispatch = useDispatch();
    const textInput = useRef<HTMLInputElement>(null);
    const [currentGoTo, setCurrentGoTo] = useState<GoToChain>({ type: GoToTypesChain.LINK, id: -1 });

    useEffect(() => {
        if (DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            handleError("Tried to go to edit sequence step without sequenceStepToEdit specified");
            dispatch(EditActions.setMode.edit());
        }
        if (chainLinkToEdit) {
            setCurrentGoTo(chainLinkToEdit.goto);
        }
        // used to focus the textfield on create another
        textInput.current!.focus();
    }, [dispatch, chainLinkToEdit]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyChainLink: ChainlinkTO = DavitUtil.deepCopy(chainLinkToEdit);
            copyChainLink.name = name;
            dispatch(EditChainLink.save(copyChainLink));
            dispatch(EditActions.setMode.editChainLink(copyChainLink));
        }
    };

    const saveChainLink = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
            if (chainLinkToEdit!.name !== "") {
                dispatch(EditChainLink.save(chainLinkToEdit!));
            } else {
                dispatch(EditChainLink.delete(chainLinkToEdit!));
            }
            if (newMode && newMode === "EDIT") {
                dispatch(EditActions.setMode.edit());
            } else {
                dispatch(EditActions.setMode.editChain(selectedChain!));
            }
        }
    };

    const deleteChainLink = () => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
            dispatch(EditChainLink.delete(chainLinkToEdit!));
            dispatch(EditActions.setMode.editChain(selectedChain!));
        }
    };

    const saveGoToType = (goTo: GoToChain) => {
        if (goTo !== undefined && !DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyChainlink: ChainlinkTO = DavitUtil.deepCopy(chainLinkToEdit);
            copyChainlink.goto = goTo;
            dispatch(EditChainLink.save(copyChainlink!));
            dispatch(EditActions.setMode.editChainLink(copyChainlink));
        }
    };

    const handleType = (newGoToType?: string) => {
        if (newGoToType !== undefined) {
            const gType = { type: (GoToTypesChain as any)[newGoToType] };
            setCurrentGoTo(gType);
            switch (newGoToType) {
                case GoToTypesChain.ERROR:
                    saveGoToType(gType);
                    break;
                case GoToTypesChain.FIN:
                    saveGoToType(gType);
                    break;
            }
        }
    };

    const setNextLink = (link?: ChainlinkTO) => {
        if (link) {
            const newGoTo: GoToChain = { type: GoToTypesChain.LINK, id: link.id };
            saveGoToType(newGoTo);
        }
    };

    const setNextDecision = (decision?: ChainDecisionTO) => {
        if (decision) {
            const newGoTo: GoToChain = { type: GoToTypesChain.DEC, id: decision.id };
            saveGoToType(newGoTo);
        }
    };

    const createNewChainLink = () => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyChainLinkToEdit: ChainlinkTO = DavitUtil.deepCopy(chainLinkToEdit);
            const newChainLink: ChainlinkTO = new ChainlinkTO();
            newChainLink.chainFk = chainLinkToEdit!.chainFk;
            dispatch(EditActions.setMode.editChainLink(newChainLink, copyChainLinkToEdit));
        }
    };

    const createGoToDecision = () => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyLinkToEdit: ChainDecisionTO = DavitUtil.deepCopy(chainLinkToEdit);
            const goToDecision: ChainDecisionTO = new ChainDecisionTO();
            goToDecision.chainFk = chainLinkToEdit!.chainFk;
            dispatch(EditActions.setMode.editChainDecision(goToDecision, copyLinkToEdit));
        }
    };

    const setDataSetup = (dataSetup?: DataSetupTO) => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyChainLinkToEdit: ChainlinkTO = DavitUtil.deepCopy(chainLinkToEdit);
            if (dataSetup) {
                copyChainLinkToEdit.dataSetupFk = dataSetup.id;
            } else {
                copyChainLinkToEdit.dataSetupFk = -1;
            }
            dispatch(EditChainLink.save(copyChainLinkToEdit));
            dispatch(EditActions.setMode.editChainLink(copyChainLinkToEdit));
        }
    };

    const setSequenceModel = (sequence?: SequenceTO) => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            const copyChainLinkToEdit: ChainlinkTO = DavitUtil.deepCopy(chainLinkToEdit);
            if (sequence) {
                copyChainLinkToEdit.sequenceFk = sequence.id;
            } else {
                copyChainLinkToEdit.sequenceFk = -1;
            }
            dispatch(EditChainLink.save(copyChainLinkToEdit));
            dispatch(EditActions.setMode.editChainLink(copyChainLinkToEdit));
        }
    };

    const setRoot = () => {
        if (!DavitUtil.isNullOrUndefined(chainLinkToEdit)) {
            dispatch(EditChain.setRoot(chainLinkToEdit!.chainFk, chainLinkToEdit!.id, false));
            dispatch(EditActions.setMode.editChainLink(EditChainLink.find(chainLinkToEdit!.id)));
        }
    };

    return {
        label: "EDIT * " + (selectedChain?.name || "") + " * " + (chainLinkToEdit?.name || ""),
        name: chainLinkToEdit ? chainLinkToEdit.name : "",
        changeName,
        saveChainLink,
        deleteChainLink,
        textInput,
        goTo: currentGoTo,
        isRoot: chainLinkToEdit?.root ? chainLinkToEdit.root : false,
        stepId: chainLinkToEdit?.id,
        currentDataSetup: chainLinkToEdit?.dataSetupFk,
        currentSequence: chainLinkToEdit?.sequenceFk,
        setDataSetup,
        setSequenceModel,
        linkId: chainLinkToEdit?.id,
        chainId: chainLinkToEdit?.chainFk || -1,
        handleType,
        setNextLink,
        setNextDecision,
        createNewChainLink,
        createGoToDecision,
        setRoot,
        id: chainLinkToEdit?.id || -1,
    };
};
