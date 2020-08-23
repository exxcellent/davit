import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ChainDecisionTO } from "../../../../../../dataAccess/access/to/ChainDecisionTO";
import { ChainlinkTO } from "../../../../../../dataAccess/access/to/ChainlinkTO";
import { ChainTO } from "../../../../../../dataAccess/access/to/ChainTO";
import { DataSetupTO } from "../../../../../../dataAccess/access/to/DataSetupTO";
import { SequenceTO } from "../../../../../../dataAccess/access/to/SequenceTO";
import { GoToChain, GoToTypesChain } from "../../../../../../dataAccess/access/types/GoToTypeChain";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ChainDecisionDropDown } from "../../../../../common/fragments/dropdowns/ChainDecisionDropDown";
import { ChainLinkDropDown } from "../../../../../common/fragments/dropdowns/ChainLinkDropDown";
import { DataSetupDropDown } from "../../../../../common/fragments/dropdowns/DataSetupDropDown";
import { GoToChainOptionDropDown } from "../../../../../common/fragments/dropdowns/GoToChainOptionDropDown";
import { SequenceDropDown } from "../../../../../common/fragments/dropdowns/SequenceDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditChainLinkProps {
  hidden: boolean
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
  } = useControllPanelEditChainStepViewModel();

  const stepName = (
    <OptionField label="Chainlink - name">
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Chainlink Name ..."
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
        unvisible={hidden}
      />
    </OptionField>
  );

  return (
    <ControllPanelEditSub label={label} hidden={hidden} onClickNavItem={saveChainLink}>
      <div className="controllPanelEditChild">{stepName}</div>
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
            <GoToChainOptionDropDown onSelect={handleType} value={goTo ? goTo.type : GoToTypesChain.ERROR} />
          </OptionField>
          {goTo!.type === GoToTypesChain.LINK && (
            <OptionField label="Create or Select next link">
              <Carv2ButtonIcon icon="add" onClick={createNewChainLink} />
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
              <Carv2ButtonIcon icon="add" onClick={createGoToDecision} />
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
        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <OptionField label="Navigation">
            <Carv2ButtonIcon onClick={saveChainLink} icon="reply" />
          </OptionField>
        </div>
        <OptionField label="Sequence - Options">
          <Carv2ButtonLabel onClick={setRoot} label={isRoot ? "Root" : "Set as Root"} disable={isRoot} />
          <div>
            <Carv2DeleteButton onClick={deleteChainLink} />
          </div>
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditChainStepViewModel = () => {
  const chainLinkToEdit: ChainlinkTO | null = useSelector(editSelectors.chainLinkToEdit);
  const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);
  const [currentGoTo, setCurrentGoTo] = useState<GoToChain>({ type: GoToTypesChain.LINK, id: -1 });

  useEffect(() => {
    if (isNullOrUndefined(chainLinkToEdit)) {
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
    if (!isNullOrUndefined(chainLinkToEdit)) {
      const copyChainLink: ChainlinkTO = Carv2Util.deepCopy(chainLinkToEdit);
      copyChainLink.name = name;
      dispatch(EditActions.chainLink.save(copyChainLink));
      dispatch(EditActions.setMode.editChainLink(copyChainLink));
    }
  };

  const saveChainLink = (newMode?: string) => {
    if (!isNullOrUndefined(chainLinkToEdit) && !isNullOrUndefined(selectedChain)) {
      if (chainLinkToEdit.name !== "") {
        dispatch(EditActions.chainLink.save(chainLinkToEdit));
      } else {
        dispatch(EditActions.chainLink.delete(chainLinkToEdit));
      }
      if (newMode && newMode === "EDIT") {
        dispatch(EditActions.setMode.edit());
      } else {
        dispatch(EditActions.setMode.editChain(selectedChain));
      }
    }
  };

  const deleteChainLink = () => {
    if (!isNullOrUndefined(chainLinkToEdit) && !isNullOrUndefined(selectedChain)) {
      dispatch(EditActions.chainLink.delete(chainLinkToEdit));
      dispatch(EditActions.setMode.editChain(selectedChain));
    }
  };

  const saveGoToType = (goTo: GoToChain) => {
    if (goTo !== undefined && !isNullOrUndefined(chainLinkToEdit)) {
      const copyChainlink: ChainlinkTO = Carv2Util.deepCopy(chainLinkToEdit);
      copyChainlink.goto = goTo;
      dispatch(EditActions.chainLink.save(copyChainlink));
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
      let newGoTo: GoToChain = { type: GoToTypesChain.LINK, id: link.id };
      saveGoToType(newGoTo);
    }
  };

  const setNextDecision = (decision?: ChainDecisionTO) => {
    if (decision) {
      let newGoTo: GoToChain = { type: GoToTypesChain.DEC, id: decision.id };
      saveGoToType(newGoTo);
    }
  };

  const createNewChainLink = () => {
    if (!isNullOrUndefined(chainLinkToEdit)) {
      const copyChainLinkToEdit: ChainlinkTO = Carv2Util.deepCopy(chainLinkToEdit);
      let newChainLink: ChainlinkTO = new ChainlinkTO();
      newChainLink.chainFk = chainLinkToEdit.chainFk;
      dispatch(EditActions.setMode.editChainLink(newChainLink, copyChainLinkToEdit));
    }
  };

  const createGoToDecision = () => {
    if (!isNullOrUndefined(chainLinkToEdit)) {
      const copyLinkToEdit: ChainDecisionTO = Carv2Util.deepCopy(chainLinkToEdit);
      let goToDecision: ChainDecisionTO = new ChainDecisionTO();
      goToDecision.chainFk = chainLinkToEdit.chainFk;
      dispatch(EditActions.setMode.editChainDecision(goToDecision, copyLinkToEdit));
    }
  };

  const setDataSetup = (dataSetup?: DataSetupTO) => {
    if (!isNullOrUndefined(chainLinkToEdit)) {
      let copyChainLinkToEdit: ChainlinkTO = Carv2Util.deepCopy(chainLinkToEdit);
      if (dataSetup) {
        copyChainLinkToEdit.dataSetupFk = dataSetup.id;
      } else {
        copyChainLinkToEdit.dataSetupFk = -1;
      }
      dispatch(EditActions.chainLink.save(copyChainLinkToEdit));
      dispatch(EditActions.setMode.editChainLink(copyChainLinkToEdit));
    }
  };

  const setSequenceModel = (sequence?: SequenceTO) => {
    if (!isNullOrUndefined(chainLinkToEdit)) {
      let copyChainLinkToEdit: ChainlinkTO = Carv2Util.deepCopy(chainLinkToEdit);
      if (sequence) {
        copyChainLinkToEdit.sequenceFk = sequence.id;
      } else {
        copyChainLinkToEdit.sequenceFk = -1;
      }
      dispatch(EditActions.chainLink.save(copyChainLinkToEdit));
      dispatch(EditActions.setMode.editChainLink(copyChainLinkToEdit));
    }
  };

  const setRoot = () => {
    if (!isNullOrUndefined(chainLinkToEdit)) {
      dispatch(EditActions.chain.setRoot(chainLinkToEdit.chainFk, chainLinkToEdit.id, false));
      dispatch(EditActions.setMode.editChainLink(EditActions.chainLink.find(chainLinkToEdit.id)));
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
  };
};
