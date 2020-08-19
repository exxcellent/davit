import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ChainDecisionTO } from "../../../../../../dataAccess/access/to/ChainDecisionTO";
import { ChainlinkTO } from "../../../../../../dataAccess/access/to/ChainlinkTO";
import { ChainTO } from "../../../../../../dataAccess/access/to/ChainTO";
import { GoToChain, GoToTypesChain } from "../../../../../../dataAccess/access/types/GoToTypeChain";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ChainDecisionDropDown } from "../../../../../common/fragments/dropdowns/ChainDecisionDropDown";
import { ChainLinkDropDown } from "../../../../../common/fragments/dropdowns/ChainLinkDropDown";
import { GoToChainOptionDropDown } from "../../../../../common/fragments/dropdowns/GoToChainOptionDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditChainDecisionProps {}

export const ControllPanelEditChainDecision: FunctionComponent<ControllPanelEditChainDecisionProps> = (props) => {
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
    isRoot,
    key,
    deleteDecision,
    createGoToDecision,
    setGoToTypeDecision,
    decId,
    chainId,
  } = useControllPanelEditChainConditionViewModel();

  const decisionName = (
    <OptionField label="Chain decision - name">
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Chain decision name ..."
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
      />
    </OptionField>
  );

  const menuButtons = (
    <div className="columnDivider controllPanelEditChild">
      <OptionField label="Navigation">
        <Carv2ButtonIcon onClick={saveDecision} icon="reply" />
      </OptionField>
      <OptionField label="Sequence - Options">
        <Carv2ButtonLabel onClick={() => {}} label={isRoot ? "Root" : "Set as Root"} disable={isRoot} />
        <div>
          <Carv2DeleteButton onClick={deleteDecision} />
        </div>
      </OptionField>
    </div>
  );

  return (
    <ControllPanelEditSub label={label} key={key}>
      <div className="controllPanelEditChild">
        {decisionName}
        <OptionField label="Create / Edit Condition">
          <Button.Group>
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Condition
            </Button>
            <Button icon="wrench" inverted color="orange" onClick={() => {}} />
          </Button.Group>
        </OptionField>
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
              <Carv2ButtonIcon icon="add" onClick={() => createGoToStep(true)} />
              <ChainLinkDropDown
                onSelect={(link) => setGoToTypeStep(true, link)}
                value={ifGoTo?.type === GoToTypesChain.LINK ? ifGoTo.id : 1}
                chainId={chainId}
              />
            </OptionField>
          )}
          {ifGoTo!.type === GoToTypesChain.DEC && (
            <OptionField label="Create or Select next decision">
              <Carv2ButtonIcon icon="add" onClick={() => createGoToDecision(true)} />
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
              <Carv2ButtonIcon icon="add" onClick={() => createGoToStep(false)} />
              <ChainLinkDropDown
                onSelect={(link) => setGoToTypeStep(false, link)}
                value={elseGoTo?.type === GoToTypesChain.LINK ? elseGoTo.id : 1}
                chainId={chainId}
              />
            </OptionField>
          )}
          {elseGoTo!.type === GoToTypesChain.DEC && (
            <OptionField label="Create or Select next condition">
              <Carv2ButtonIcon icon="add" onClick={() => createGoToDecision(false)} />
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
      {menuButtons}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditChainConditionViewModel = () => {
  const decisionToEdit: ChainDecisionTO | null = useSelector(editSelectors.chainDecisionToEdit);
  const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);
  const [currentIfGoTo, setCurrentIfGoTo] = useState<GoToChain>({ type: GoToTypesChain.FIN });
  const [currentElseGoTo, setCurrentElseGoTo] = useState<GoToChain>({ type: GoToTypesChain.ERROR });
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    if (isNullOrUndefined(decisionToEdit)) {
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
    if (!isNullOrUndefined(decisionToEdit)) {
      const copyDecisionToEdit: ChainDecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.name = name;
      dispatch(EditActions.setMode.editChainDecision(copyDecisionToEdit));
    }
  };

  const saveDecision = () => {
    if (!isNullOrUndefined(decisionToEdit) && !isNullOrUndefined(selectedChain)) {
      dispatch(EditActions.chainDecision.save(decisionToEdit));
      dispatch(EditActions.setMode.editChain(selectedChain));
    }
  };

  const deleteDecision = () => {
    if (!isNullOrUndefined(decisionToEdit) && !isNullOrUndefined(selectedChain)) {
      dispatch(EditActions.chainDecision.delete(decisionToEdit));
      dispatch(EditActions.setMode.editChain(selectedChain));
    }
  };

  const validStep = (): boolean => {
    let valid: boolean = false;
    if (!isNullOrUndefined(decisionToEdit)) {
      if (decisionToEdit.name !== "") {
        valid = true;
      }
    }
    return valid;
  };

  const saveGoToType = (ifGoTo: boolean, goTo: GoToChain) => {
    if (goTo !== undefined) {
      const copyDecisionToEdit: ChainDecisionTO = Carv2Util.deepCopy(decisionToEdit);
      ifGoTo ? (copyDecisionToEdit.ifGoTo = goTo) : (copyDecisionToEdit.elseGoTo = goTo);
      dispatch(EditActions.chainDecision.save(copyDecisionToEdit));
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
      let newGoTo: GoToChain = { type: GoToTypesChain.LINK, id: link.id };
      saveGoToType(ifGoTo, newGoTo);
    }
  };

  const setGoToTypeDecision = (ifGoTo: boolean, decision?: ChainDecisionTO) => {
    if (decision) {
      let newGoTo: GoToChain = { type: GoToTypesChain.DEC, id: decision.id };
      saveGoToType(ifGoTo, newGoTo);
    }
  };

  const createGoToLink = (ifGoTo: boolean) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      const copyDecision: ChainDecisionTO = Carv2Util.deepCopy(decisionToEdit);
      let goToLink: ChainlinkTO = new ChainlinkTO();
      goToLink.chainFk = decisionToEdit.chainFk;
      dispatch(EditActions.setMode.editChainLink(goToLink, copyDecision, ifGoTo));
    }
  };

  const createGoToDecision = (ifGoTo: boolean) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      let goToDecision: ChainDecisionTO = new ChainDecisionTO();
      goToDecision.chainFk = decisionToEdit.chainFk;
      const copyDecisionToEdit: ChainDecisionTO = Carv2Util.deepCopy(decisionToEdit);
      dispatch(EditActions.setMode.editChainDecision(goToDecision, copyDecisionToEdit, ifGoTo));
      setKey(key + 1);
    }
  };

  // const setRoot = () => {
  //   if (!isNullOrUndefined(decisionToEdit)) {
  //     dispatch(EditActions.sequence.setRoot(decisionToEdit.sequenceFk, decisionToEdit.id, true));
  //     dispatch(EditActions.setMode.editDecision(EditActions.decision.find(decisionToEdit.id)));
  //   }
  // };

  // TODO: to be implemented!
  // const editOrAddCondition = () => {
  //   if (decisionToEdit !== null) {
  //     dispatch(EditActions.setMode.editCondition(decisionToEdit));
  //   }
  // };

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
    // setRoot,
    isRoot: decisionToEdit?.root ? decisionToEdit.root : false,
    key,
    // editOrAddCondition,
    decId: decisionToEdit?.id,
    chainId: decisionToEdit?.chainFk || -1,
  };
};
