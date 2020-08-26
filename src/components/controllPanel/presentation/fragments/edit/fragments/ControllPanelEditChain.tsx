import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ChainDecisionTO } from "../../../../../../dataAccess/access/to/ChainDecisionTO";
import { ChainlinkTO } from "../../../../../../dataAccess/access/to/ChainlinkTO";
import { ChainTO } from "../../../../../../dataAccess/access/to/ChainTO";
import { SequenceTO } from "../../../../../../dataAccess/access/to/SequenceTO";
import { EditActions } from "../../../../../../slices/EditSlice";
import { masterDataSelectors } from "../../../../../../slices/MasterDataSlice";
import { sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ChainDecisionDropDownButton } from "../../../../../common/fragments/dropdowns/ChainDecisionDropDown";
import { ChainLinkDropDownButton } from "../../../../../common/fragments/dropdowns/ChainLinkDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditChainProps {
  hidden: boolean;
}

export const ControllPanelEditChain: FunctionComponent<ControllPanelEditChainProps> = (props) => {
  const { hidden } = props;
  const {
    label,
    name,
    textInput,
    changeName,
    createAnother,
    editOrAddDecision,
    saveChain,
    deleteChain,
    id,
    editOrAddChainLink,
  } = useControllPanelEditChainViewModel();

  const menuButtons = (
    <div className="columnDivider controllPanelEditChild">
      <OptionField label="Navigation">
        <Carv2ButtonLabel onClick={createAnother} label="Create another" />
        <Carv2ButtonIcon onClick={saveChain} icon="reply" />
      </OptionField>
      <OptionField label="Sequence - Options">
        <Carv2DeleteButton onClick={deleteChain} />
      </OptionField>
    </div>
  );

  return (
    <ControllPanelEditSub label={label} hidden={hidden} onClickNavItem={saveChain}>
      <div className="controllPanelEditChild">
        <OptionField label="Chain - name">
          <Carv2LabelTextfield
            label="Name:"
            placeholder="Chain Name..."
            onChange={(event: any) => changeName(event.target.value)}
            value={name}
            autoFocus
            ref={textInput}
            unvisible={hidden}
          />
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <OptionField label="Create / Edit | Chain - Sequence">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddChainLink()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Sequence
            </Button>
            <ChainLinkDropDownButton onSelect={(link) => editOrAddChainLink(link)} icon="wrench" chainId={id} />
          </Button.Group>
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <OptionField label="Create / Edit | Chain - Decision">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddDecision()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Decision
            </Button>
            <ChainDecisionDropDownButton onSelect={editOrAddDecision} icon="wrench" chainId={id} />
          </Button.Group>
        </OptionField>
      </div>
      {menuButtons}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditChainViewModel = () => {
  const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
  const isFirst: boolean = useSelector(masterDataSelectors.isFirstChainElement(selectedChain?.id || -1));
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // check if sequence to edit is really set or gos back to edit mode
    if (isNullOrUndefined(selectedChain)) {
      console.warn("Tried to go to edit sequence without chain specified" + selectedChain);
      dispatch(EditActions.setMode.edit());
    }
    if (selectedChain?.id !== -1) {
      setIsCreateAnother(false);
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [selectedChain, dispatch]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(selectedChain)) {
      let copyChainToEdit: ChainTO = Carv2Util.deepCopy(selectedChain);
      copyChainToEdit.name = name;
      dispatch(EditActions.chain.save(copyChainToEdit));
    }
  };

  const saveChain = (newMode?: string) => {
    if (!isNullOrUndefined(selectedChain)) {
      if (selectedChain.name !== "") {
        dispatch(EditActions.chain.save(selectedChain));
      } else {
        dispatch(EditActions.chain.delete(selectedChain));
      }
      if (isCreateAnother && !newMode) {
        dispatch(EditActions.setMode.editChain());
      } else {
        dispatch(EditActions.setMode.edit());
      }
    }
  };

  const deleteChain = () => {
    if (!isNullOrUndefined(selectedChain)) {
      dispatch(EditActions.chain.delete(selectedChain));
    }
    dispatch(EditActions.setMode.edit());
  };

  const validateInput = (): boolean => {
    if (!isNullOrUndefined(selectedChain)) {
      return Carv2Util.isValidName(selectedChain.name);
    } else {
      return false;
    }
  };

  const editOrAddChainLink = (link?: ChainlinkTO) => {
    let chainLinkToEdit: ChainlinkTO | undefined = link;
    if (chainLinkToEdit === undefined) {
      chainLinkToEdit = new ChainlinkTO();
      chainLinkToEdit.chainFk = selectedChain?.id || -1;
      chainLinkToEdit.root = isFirst;
    }
    dispatch(EditActions.setMode.editChainLink(chainLinkToEdit));
  };

  const editOrAddChainDecision = (decision?: ChainDecisionTO) => {
    let decisionToEdit: ChainDecisionTO | undefined = decision;
    if (decisionToEdit === undefined) {
      decisionToEdit = new ChainDecisionTO();
      decisionToEdit.chainFk = selectedChain?.id || -1;
    }
    dispatch(EditActions.setMode.editChainDecision(decisionToEdit));
  };

  const createAnother = () => {
    dispatch(EditActions.setMode.editSequence());
  };

  const updateSequence = () => {
    let copySequence: SequenceTO = Carv2Util.deepCopy(selectedChain);
    dispatch(EditActions.sequence.save(copySequence));
  };

  return {
    label: "EDIT * " + (selectedChain?.name || ""),
    name: selectedChain?.name,
    id: selectedChain?.id ? selectedChain.id : -1,
    changeName,
    saveChain,
    deleteChain,
    textInput,
    validateInput,
    createAnother,
    updateSequence,
    editOrAddDecision: editOrAddChainDecision,
    editOrAddChainLink,
  };
};
