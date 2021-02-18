import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { ChainDecisionTO } from "../../../../../../dataAccess/access/to/ChainDecisionTO";
import { ChainlinkTO } from "../../../../../../dataAccess/access/to/ChainlinkTO";
import { ChainTO } from "../../../../../../dataAccess/access/to/ChainTO";
import { GoToChain, GoToTypesChain } from "../../../../../../dataAccess/access/types/GoToTypeChain";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { EditChainDecision } from "../../../../../../slices/thunks/ChainDecisionThunks";
import { DavitUtil } from "../../../../../../utils/DavitUtil";
import { DavitAddButton } from "../../../../../common/fragments/buttons/DavitAddButton";
import { DavitBackButton } from "../../../../../common/fragments/buttons/DavitBackButton";
import { DavitDeleteButton } from "../../../../../common/fragments/buttons/DavitDeleteButton";
import { ChainDecisionDropDown } from "../../../../../common/fragments/dropdowns/ChainDecisionDropDown";
import { ChainLinkDropDown } from "../../../../../common/fragments/dropdowns/ChainLinkDropDown";
import { GoToChainOptionDropDown } from "../../../../../common/fragments/dropdowns/GoToChainOptionDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { DavitLabelTextfield } from "../common/fragments/DavitLabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditChainDecisionProps {
    hidden: boolean;
}

export const ControllPanelEditChainDecision: FunctionComponent<ControllPanelEditChainDecisionProps> = (props) => {
    const { hidden } = props;
    const {
        label,
        name,
        changeName,
        saveDecision,
        textInput,
        handleType,
        ifGoTo,
        elseGoTo,
        setGoToTypeStep,
        createGoToStep,
        key,
        deleteDecision,
        createGoToDecision,
        setGoToTypeDecision,
        decId,
        chainId,
        editOrAddChainCondition,
    } = useControllPanelEditChainConditionViewModel();

    return (
        <ControllPanelEditSub label={label} key={key} hidden={hidden} onClickNavItem={saveDecision}>
            <div className="controllPanelEditChild">
                <div className="optionField">
                    <OptionField label="Chain decision - name">
                        <DavitLabelTextfield
                            label="Name:"
                            placeholder="Chain decision name ..."
                            onChangeDebounced={(name: string) => changeName(name)}
                            value={name}
                            autoFocus
                            ref={textInput}
                            unvisible={hidden}
                        />
                    </OptionField>
                    <OptionField label="Create / Edit Condition">
                        <Button.Group>
                            <Button id="buttonGroupLabel" disabled inverted color="orange">
                                Condition
                            </Button>
                            <Button icon="wrench" inverted color="orange" onClick={editOrAddChainCondition} />
                        </Button.Group>
                    </OptionField>
                </div>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <OptionField label="Type condition true">
                        <GoToChainOptionDropDown
                            onSelect={(gt) => {
                                handleType(true, gt);
                            }}
                            value={ifGoTo ? ifGoTo.type : GoToTypesChain.FIN}
                        />
                    </OptionField>
                    {ifGoTo!.type === GoToTypesChain.LINK && (
                        <OptionField label="Create or Select next link">
                            <DavitAddButton onClick={() => createGoToStep(true)} />
                            <ChainLinkDropDown
                                onSelect={(link) => setGoToTypeStep(true, link)}
                                value={ifGoTo?.type === GoToTypesChain.LINK ? ifGoTo.id : 1}
                                chainId={chainId}
                            />
                        </OptionField>
                    )}
                    {ifGoTo!.type === GoToTypesChain.DEC && (
                        <OptionField label="Create or Select next decision">
                            <DavitAddButton onClick={() => createGoToDecision(true)} />
                            <ChainDecisionDropDown
                                onSelect={(cond) => setGoToTypeDecision(true, cond)}
                                value={ifGoTo?.type === GoToTypesChain.DEC ? ifGoTo.id : 1}
                                exclude={decId}
                                chainId={chainId}
                            />
                        </OptionField>
                    )}
                </div>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <OptionField label="Type condition false">
                        <GoToChainOptionDropDown
                            onSelect={(gt) => handleType(false, gt)}
                            value={elseGoTo ? elseGoTo.type : GoToTypesChain.ERROR}
                        />
                    </OptionField>
                    {elseGoTo!.type === GoToTypesChain.LINK && (
                        <OptionField label="Select type of the next element">
                            <DavitAddButton onClick={() => createGoToStep(false)} />
                            <ChainLinkDropDown
                                onSelect={(link) => setGoToTypeStep(false, link)}
                                value={elseGoTo?.type === GoToTypesChain.LINK ? elseGoTo.id : 1}
                                chainId={chainId}
                            />
                        </OptionField>
                    )}
                    {elseGoTo!.type === GoToTypesChain.DEC && (
                        <OptionField label="Create or Select next condition">
                            <DavitAddButton onClick={() => createGoToDecision(false)} />
                            <ChainDecisionDropDown
                                onSelect={(cond) => setGoToTypeDecision(false, cond)}
                                value={elseGoTo?.type === GoToTypesChain.DEC ? elseGoTo.id : 1}
                                exclude={decId}
                                chainId={chainId}
                            />
                        </OptionField>
                    )}
                </div>
            </div>
            <div className="columnDivider controllPanelEditChild">
                <div className="optionFieldSpacer">
                    <OptionField label="Navigation">
                        <DavitBackButton onClick={saveDecision} />
                    </OptionField>
                </div>
                <div className="optionFieldSpacer">
                    <OptionField label="Sequence - Options">
                        <DavitDeleteButton onClick={deleteDecision} />
                    </OptionField>
                </div>
            </div>
        </ControllPanelEditSub>
    );
};

const useControllPanelEditChainConditionViewModel = () => {
    const decisionToEdit: ChainDecisionTO | null = useSelector(editSelectors.selectChainDecisionToEdit);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const dispatch = useDispatch();
    const textInput = useRef<Input>(null);
    const [currentIfGoTo, setCurrentIfGoTo] = useState<GoToChain>({ type: GoToTypesChain.FIN });
    const [currentElseGoTo, setCurrentElseGoTo] = useState<GoToChain>({ type: GoToTypesChain.ERROR });
    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        if (DavitUtil.isNullOrUndefined(decisionToEdit)) {
            dispatch(handleError("Tried to go to edit condition step without conditionToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }
        if (decisionToEdit) {
            console.warn("set curretn go to type: ", decisionToEdit.ifGoTo);
            setCurrentIfGoTo(decisionToEdit.ifGoTo);
            setCurrentElseGoTo(decisionToEdit.elseGoTo);
        }
        // used to focus the textfield on create another
        textInput.current!.focus();
    }, [dispatch, decisionToEdit]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecisionToEdit: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecisionToEdit.name = name;
            dispatch(EditActions.setMode.editChainDecision(copyDecisionToEdit));
        }
    };

    const saveDecision = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
            if (decisionToEdit!.name !== "") {
                dispatch(EditChainDecision.save(decisionToEdit!));
            } else {
                dispatch(EditChainDecision.delete(decisionToEdit!));
            }
            if (newMode && newMode === "EDIT") {
                dispatch(EditActions.setMode.edit());
            } else {
                dispatch(EditActions.setMode.editChain(selectedChain!));
            }
        }
    };

    const deleteDecision = () => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
            dispatch(EditChainDecision.delete(decisionToEdit!));
            dispatch(EditActions.setMode.editChain(selectedChain!));
        }
    };

    const validStep = (): boolean => {
        let valid: boolean = false;
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            if (decisionToEdit!.name !== "") {
                valid = true;
            }
        }
        return valid;
    };

    const saveGoToType = (ifGoTo: boolean, goTo: GoToChain) => {
        if (goTo !== undefined) {
            const copyDecisionToEdit: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            ifGoTo ? (copyDecisionToEdit.ifGoTo = goTo) : (copyDecisionToEdit.elseGoTo = goTo);
            dispatch(EditChainDecision.save(copyDecisionToEdit));
            dispatch(EditActions.setMode.editChainDecision(copyDecisionToEdit));
        }
    };

    const handleType = (ifGoTo: boolean, newGoToType?: string) => {
        if (newGoToType !== undefined) {
            const gType = { type: (GoToTypesChain as any)[newGoToType] };
            ifGoTo ? setCurrentIfGoTo(gType) : setCurrentElseGoTo(gType);
            switch (newGoToType) {
                case GoToTypesChain.ERROR:
                    saveGoToType(ifGoTo, gType);
                    break;
                case GoToTypesChain.FIN:
                    saveGoToType(ifGoTo, gType);
                    break;
            }
        }
    };

    const setGoToTypeStep = (ifGoTo: boolean, link?: ChainlinkTO) => {
        if (link) {
            const newGoTo: GoToChain = { type: GoToTypesChain.LINK, id: link.id };
            saveGoToType(ifGoTo, newGoTo);
        }
    };

    const setGoToTypeDecision = (ifGoTo: boolean, decision?: ChainDecisionTO) => {
        if (decision) {
            const newGoTo: GoToChain = { type: GoToTypesChain.DEC, id: decision.id };
            saveGoToType(ifGoTo, newGoTo);
        }
    };

    const createGoToLink = (ifGoTo: boolean) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecision: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            const goToLink: ChainlinkTO = new ChainlinkTO();
            goToLink.chainFk = decisionToEdit!.chainFk;
            dispatch(EditActions.setMode.editChainLink(goToLink, copyDecision, ifGoTo));
        }
    };

    const createGoToDecision = (ifGoTo: boolean) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const goToDecision: ChainDecisionTO = new ChainDecisionTO();
            goToDecision.chainFk = decisionToEdit!.chainFk;
            const copyDecisionToEdit: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            dispatch(EditActions.setMode.editChainDecision(goToDecision, copyDecisionToEdit, ifGoTo));
            setKey(key + 1);
        }
    };

    const editOrAddChainCondition = () => {
        if (decisionToEdit !== null) {
            dispatch(EditActions.setMode.editChainCondition(decisionToEdit));
        }
    };

    return {
        label: "EDIT * " + (selectedChain?.name || "") + " * " + (decisionToEdit?.name || ""),
        name: decisionToEdit?.name,
        changeName,
        saveDecision,
        textInput,
        validStep,
        deleteDecision,
        handleType,
        setGoToTypeStep,
        setGoToTypeDecision,
        ifGoTo: currentIfGoTo,
        elseGoTo: currentElseGoTo,
        createGoToStep: createGoToLink,
        createGoToDecision,
        key,
        decId: decisionToEdit?.id,
        chainId: decisionToEdit?.chainFk || -1,
        editOrAddChainCondition,
    };
};
