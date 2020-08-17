import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ChainStepTO } from "../../../../../../dataAccess/access/to/ChainStepTO";
import { ChainTO } from "../../../../../../dataAccess/access/to/ChainTO";
import { GoTo, GoToTypes } from "../../../../../../dataAccess/access/types/GoToType";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditChainStepProps {}

export const ControllPanelEditChainStep: FunctionComponent<ControllPanelEditChainStepProps> = (props) => {
  const {
    label,
    name,
    changeName,
    deleteChainStep,
    textInput,
    goTo,
    isRoot,
    key,
    saveChainStep,
  } = useControllPanelEditChainStepViewModel();

  const stepName = (
    <OptionField label="ChainStep - name">
      <Carv2LabelTextfield
        label="Name:"
        placeholder="ChainStep Name ..."
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
      />
    </OptionField>
  );

  return (
    <ControllPanelEditSub label={label} key={key}>
      <div className="controllPanelEditChild">{stepName}</div>
      <div className="optionFieldSpacer columnDivider">
        {/* <DataSetupDropDown onSelect={selectDataSetup} placeholder="Select Data Setup ..." value={currentDataSetup} /> */}
        {/* <SequenceDropDown onSelect={selectSequence} value={currentSequence} /> */}
      </div>
      <div className="optionFieldSpacer columnDivider">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <OptionField label="Select type of the next element">
            {/* <GoToOptionDropDown onSelect={handleType} value={goTo ? goTo.type : GoToTypes.ERROR} /> */}
          </OptionField>
          {goTo!.type === GoToTypes.STEP && (
            <OptionField label="Create or Select next step">
              {/* <Carv2ButtonIcon icon="add" onClick={createGoToStep} /> */}
              {/* <StepDropDown
                onSelect={setGoToTypeStep}
                value={goTo?.type === GoToTypes.STEP ? goTo.id : 1}
                exclude={stepId}
              /> */}
            </OptionField>
          )}
          {/* {goTo!.type === GoToTypes.COND && (
            <OptionField label="Create or Select next decision">
              <Carv2ButtonIcon icon="add" onClick={createGoToDecision} />
              <DecisionDropDown onSelect={setGoToTypeDecision} value={goTo?.type === GoToTypes.COND ? goTo.id : 1} />
            </OptionField>
          )} */}
        </div>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <OptionField label="Navigation">
            <Carv2ButtonIcon onClick={saveChainStep} icon="reply" />
          </OptionField>
        </div>
        <OptionField label="Sequence - Options">
          <Carv2ButtonLabel onClick={() => {}} label={isRoot ? "Root" : "Set as Root"} disable={isRoot} />
          <div>
            <Carv2DeleteButton onClick={deleteChainStep} />
          </div>
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditChainStepViewModel = () => {
  const chainStepToEdit: ChainStepTO | null = useSelector(editSelectors.chainStepToEdit);
  const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);
  const [currentGoTo, setCurrentGoTo] = useState<GoTo>({ type: GoToTypes.STEP, id: -1 });
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    if (isNullOrUndefined(chainStepToEdit)) {
      handleError("Tried to go to edit sequence step without sequenceStepToEdit specified");
      dispatch(EditActions.setMode.edit());
    }
    if (chainStepToEdit) {
      setCurrentGoTo(chainStepToEdit.goto);
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dispatch, chainStepToEdit]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(chainStepToEdit)) {
      const copyChainStep: ChainStepTO = Carv2Util.deepCopy(chainStepToEdit);
      copyChainStep.name = name;
      dispatch(EditActions.chainStep.save(copyChainStep));
    }
  };

  const saveChainStep = () => {
    if (!isNullOrUndefined(chainStepToEdit) && !isNullOrUndefined(selectedChain)) {
      dispatch(EditActions.chainStep.save(chainStepToEdit));
      dispatch(EditActions.setMode.editChain(selectedChain));
    }
  };

  const deleteChainStep = () => {
    console.warn("try delete chain step.");
    if (!isNullOrUndefined(chainStepToEdit) && !isNullOrUndefined(selectedChain)) {
      console.warn("delete chain step.");
      dispatch(EditActions.chainStep.delete(chainStepToEdit));
      dispatch(EditActions.setMode.editChain(selectedChain));
    }
  };

  // const editOrAddAction = (action?: ActionTO) => {
  //   if (!isNullOrUndefined(chainStepToEdit)) {
  //     let copyAction: ActionTO | undefined = Carv2Util.deepCopy(action);
  //     if (copyAction === undefined) {
  //       copyAction = new ActionTO();
  //       copyAction.sequenceStepFk = chainStepToEdit.id;
  //       dispatch(EditActions.action.create(copyAction));
  //     } else {
  //       dispatch(EditActions.setMode.editAction(copyAction));
  //     }
  //   }
  // };

  // const validStep = (): boolean => {
  //   let valid: boolean = false;
  //   if (!isNullOrUndefined(stepToEdit)) {
  //     if (stepToEdit.squenceStepTO.name !== "") {
  //       valid = true;
  //     }
  //   }
  //   return valid;
  // };

  // const saveGoToType = (goTo: GoTo) => {
  //   if (goTo !== undefined) {
  //     const copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(chainStepToEdit);
  //     copySequenceStep.squenceStepTO.goto = goTo;
  //     dispatch(EditActions.chainstep.update(copySequenceStep));
  //     dispatch(EditActions.chainstep.save(copySequenceStep));
  //     dispatch(SequenceModelActions.setCurrentSequence(copySequenceStep.squenceStepTO.sequenceFk));
  //   }
  // };

  // const handleType = (newGoToType?: string) => {
  //   if (newGoToType !== undefined) {
  //     const gType = { type: (GoToTypes as any)[newGoToType] };
  //     setCurrentGoTo(gType);
  //     switch (newGoToType) {
  //       case GoToTypes.ERROR:
  //         saveGoToType(gType);
  //         break;
  //       case GoToTypes.FIN:
  //         saveGoToType(gType);
  //         break;
  //     }
  //   }
  // };

  // const setGoToTypeStep = (step?: SequenceStepCTO) => {
  //   if (step) {
  //     let newGoTo: GoTo = { type: GoToTypes.STEP, id: step.squenceStepTO.id };
  //     saveGoToType(newGoTo);
  //   }
  // };

  // const setGoToTypeDecision = (decision?: DecisionTO) => {
  //   if (decision) {
  //     let newGoTo: GoTo = { type: GoToTypes.COND, id: decision.id };
  //     saveGoToType(newGoTo);
  //   }
  // };

  // const createGoToStep = () => {
  //   if (!isNullOrUndefined(stepToEdit)) {
  //     let goToStep: SequenceStepCTO = new SequenceStepCTO();
  //     goToStep.squenceStepTO.sequenceFk = stepToEdit.squenceStepTO.sequenceFk;
  //     const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
  //     setKey(key + 1);
  //     dispatch(EditActions.setMode.editStep(goToStep, copyStepToEdit));
  //     dispatch(SequenceModelActions.setCurrentSequence(goToStep.squenceStepTO.sequenceFk));
  //   }
  // };

  // const createGoToDecision = () => {
  //   if (!isNullOrUndefined(stepToEdit)) {
  //     let goToDecision: DecisionTO = new DecisionTO();
  //     goToDecision.sequenceFk = stepToEdit.squenceStepTO.sequenceFk;
  //     const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
  //     dispatch(EditActions.setMode.editDecision(goToDecision, copyStepToEdit));
  //   }
  // };

  // const setRoot = () => {
  //   if (!isNullOrUndefined(chainStepToEdit) && !isNullOrUndefined(selectedChain)) {
  //     dispatch(EditActions.chain.setRoot(chainStepToEdit.chainFk, chainStepToEdit.id, false));
  //     dispatch(EditActions.chainStep.save(EditActions.step.find(stepToEdit.squenceStepTO.id)));
  //   }
  // };

  return {
    label: "EDIT * " + (selectedChain?.name || "") + " * " + (chainStepToEdit?.name || ""),
    name: chainStepToEdit ? chainStepToEdit!.name : "",
    changeName,
    saveChainStep,
    deleteChainStep,
    textInput,
    sourceCompId: chainStepToEdit?.sourceChainlinkFk !== -1 ? chainStepToEdit?.sourceChainlinkFk : undefined,
    targetCompId: chainStepToEdit?.targetChainlinkFk !== -1 ? chainStepToEdit?.targetChainlinkFk : undefined,
    goTo: currentGoTo,
    isRoot: chainStepToEdit?.root ? chainStepToEdit?.root : false,
    key,
    stepId: chainStepToEdit?.id,
  };
};
