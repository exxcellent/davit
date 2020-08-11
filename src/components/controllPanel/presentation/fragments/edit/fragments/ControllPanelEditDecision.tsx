import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { DecisionTO } from "../../../../../../dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes } from "../../../../../../dataAccess/access/types/GoToType";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { DecisionDropDown } from "../../../../../common/fragments/dropdowns/DecisionDropDown";
import { GoToOptionDropDown } from "../../../../../common/fragments/dropdowns/GoToOptionDropDown";
import { MultiselectDataDropDown } from "../../../../../common/fragments/dropdowns/MultiselectDataDropDown";
import { StepDropDown } from "../../../../../common/fragments/dropdowns/StepDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditDecisionProps {}

export const ControllPanelEditDecision: FunctionComponent<ControllPanelEditDecisionProps> = (props) => {
  const {
    label,
    name,
    changeName,
    saveDecision,
    textInput,
    setComponent,
    compId,
    setData,
    datas,
    setHas,
    handleType,
    ifGoTo,
    elseGoTo,
    setGoToTypeStep,
    createGoToStep,
    setRoot,
    isRoot,
    key,
    updateDecision,
    getDecision,
    deleteDecision,
    createGoToDecision,
    setGoToTypeDecision,
  } = useControllPanelEditConditionViewModel();

  const conditionName = (
    <OptionField label="Condition - name">
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Condition Name ..."
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
        onBlur={() => updateDecision()}
      />
    </OptionField>
  );

  const hasDropDown = (
    <OptionField label="Codition - true / false">
      <Dropdown
        options={[
          { key: 1, value: 1, text: "true" },
          { key: 2, value: 2, text: "false" },
        ]}
        compact
        selection
        selectOnBlur={false}
        onChange={(event, data) => setHas(data.value as number)}
        value={getDecision()}
      />
    </OptionField>
  );

  const dropDowns = (
    <div className="optionFieldSpacer columnDivider">
      <div style={{ display: "flex" }}>
        <OptionField label="Select a component">
          <ComponentDropDown
            onSelect={(comp) => {
              setComponent(comp);
              updateDecision();
            }}
            value={compId}
            compact
          />
        </OptionField>
        <OptionField label="Select data for component">
          <MultiselectDataDropDown
            onSelect={(data) => {
              setData(data);
              updateDecision();
            }}
            selected={datas}
          />
        </OptionField>
      </div>
    </div>
  );

  const menuButtons = (
    <div className="columnDivider controllPanelEditChild">
      <OptionField label="Navigation">
        <Carv2ButtonIcon onClick={saveDecision} icon="reply" />
      </OptionField>
      <OptionField label="Sequence - Options">
        <Carv2ButtonLabel onClick={setRoot} label={isRoot ? "Root" : "Set as Root"} disable={isRoot} />
        <div>
          <Carv2DeleteButton onClick={deleteDecision} />
        </div>
      </OptionField>
    </div>
  );

  return (
    <ControllPanelEditSub label={label} key={key}>
      <div className="controllPanelEditChild">
        {conditionName}
        {hasDropDown}
      </div>
      {dropDowns}

      <div className="columnDivider optionFieldSpacer">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <OptionField>
            <OptionField label="Select type of the next element">
              <GoToOptionDropDown
                onSelect={(gt) => handleType(true, gt)}
                value={ifGoTo ? ifGoTo.type : GoToTypes.ERROR}
              />
            </OptionField>

            {ifGoTo!.type === GoToTypes.STEP && (
              <OptionField label="Create or Select next step">
                <Carv2ButtonIcon icon="add" onClick={() => createGoToStep(true)} />
                <StepDropDown
                  onSelect={(step) => setGoToTypeStep(true, step)}
                  value={ifGoTo?.type === GoToTypes.STEP ? ifGoTo.id : 1}
                />
              </OptionField>
            )}
            {ifGoTo!.type === GoToTypes.COND && (
              <OptionField label="Create or Select next condition">
                <Carv2ButtonIcon icon="add" onClick={() => createGoToDecision(true)} />
                <DecisionDropDown
                  onSelect={(cond) => setGoToTypeDecision(true, cond)}
                  value={ifGoTo?.type === GoToTypes.COND ? ifGoTo.id : 1}
                />
              </OptionField>
            )}
          </OptionField>

          <OptionField>
            <OptionField label="Select type of the next element">
              <GoToOptionDropDown
                onSelect={(gt) => handleType(false, gt)}
                value={elseGoTo ? elseGoTo.type : GoToTypes.ERROR}
              />
            </OptionField>
            {elseGoTo!.type === GoToTypes.STEP && (
              <OptionField label="Select type of the next element">
                <Carv2ButtonIcon icon="add" onClick={() => createGoToStep(false)} />
                <StepDropDown
                  onSelect={(step) => setGoToTypeStep(false, step)}
                  value={elseGoTo?.type === GoToTypes.STEP ? elseGoTo.id : 1}
                />
              </OptionField>
            )}
            {elseGoTo!.type === GoToTypes.COND && (
              <OptionField label="Create or Select next condition">
                <Carv2ButtonIcon icon="add" onClick={() => createGoToDecision(false)} />
                <DecisionDropDown
                  onSelect={(cond) => setGoToTypeDecision(false, cond)}
                  value={elseGoTo?.type === GoToTypes.COND ? elseGoTo.id : 1}
                />
              </OptionField>
            )}
          </OptionField>
        </div>
      </div>
      {menuButtons}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditConditionViewModel = () => {
  const decisionToEdit: DecisionTO | null = useSelector(editSelectors.decisionToEdit);
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);
  const [currentIfGoTo, setCurrentIfGoTo] = useState<GoTo>({ type: GoToTypes.STEP, id: -1 });
  const [currentElseGoTo, setCurrentElseGoTo] = useState<GoTo>({ type: GoToTypes.STEP, id: -1 });
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    if (isNullOrUndefined(decisionToEdit)) {
      console.warn(decisionToEdit);
      dispatch(handleError("Tried to go to edit condition step without conditionToEdit specified"));
      dispatch(EditActions.setMode.edit());
    }
    if (decisionToEdit) {
      setCurrentIfGoTo(decisionToEdit.ifGoTo);
      setCurrentElseGoTo(decisionToEdit.elseGoTo);
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dispatch, decisionToEdit]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      const copyConditionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyConditionToEdit.name = name;
      dispatch(EditActions.setMode.editDecision(copyConditionToEdit));
      dispatch(SequenceModelActions.setCurrentSequence(copyConditionToEdit.sequenceFk));
    }
  };

  const setComponent = (component: ComponentCTO | undefined) => {
    if (component !== undefined && !isNullOrUndefined(decisionToEdit)) {
      const copyConditionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyConditionToEdit.componentFk = component.component.id;
      dispatch(EditActions.setMode.editDecision(copyConditionToEdit));
    }
  };

  const setData = (dataIds: number[] | undefined) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      const copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.dataFks = dataIds || [];
      dispatch(EditActions.setMode.editDecision(copyDecisionToEdit));
    }
  };

  const saveDecision = () => {
    if (!isNullOrUndefined(decisionToEdit) && !isNullOrUndefined(selectedSequence)) {
      dispatch(EditActions.decision.save(decisionToEdit));
      dispatch(EditActions.setMode.editSequence(decisionToEdit.sequenceFk));
    }
  };

  const deleteDecision = () => {
    if (!isNullOrUndefined(decisionToEdit) && !isNullOrUndefined(selectedSequence)) {
      dispatch(EditActions.decision.delete(decisionToEdit, selectedSequence));
      dispatch(EditActions.setMode.editSequence(decisionToEdit.sequenceFk));
    }
  };

  const updateDecision = () => {
    const copyDecision: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
    dispatch(EditActions.decision.save(copyDecision));
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

  const saveGoToType = (ifGoTo: Boolean, goTo: GoTo) => {
    if (goTo !== undefined) {
      const copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      ifGoTo ? (copyDecisionToEdit.ifGoTo = goTo) : (copyDecisionToEdit.elseGoTo = goTo);
      dispatch(EditActions.decision.update(copyDecisionToEdit));
      dispatch(EditActions.decision.save(copyDecisionToEdit));
      dispatch(SequenceModelActions.setCurrentSequence(copyDecisionToEdit.sequenceFk));
    }
  };

  const handleType = (ifGoTo: Boolean, newGoToType?: string) => {
    if (newGoToType !== undefined) {
      const gType = { type: (GoToTypes as any)[newGoToType] };
      ifGoTo ? setCurrentIfGoTo(gType) : setCurrentElseGoTo(gType);
      switch (newGoToType) {
        case GoToTypes.ERROR:
          saveGoToType(ifGoTo, gType);
          break;
        case GoToTypes.FIN:
          saveGoToType(ifGoTo, gType);
          break;
      }
    }
  };

  const setHas = (setHas: number | undefined) => {
    console.info("has: ", setHas);
    if (!isNullOrUndefined(decisionToEdit) && !isNullOrUndefined(setHas)) {
      let copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.has = setHas === 1 ? true : false;
      dispatch(EditActions.setMode.editDecision(copyDecisionToEdit));
    }
  };

  const setGoToTypeStep = (ifGoTo: Boolean, step?: SequenceStepCTO) => {
    if (step) {
      let newGoTo: GoTo = { type: GoToTypes.STEP, id: step.squenceStepTO.id };
      saveGoToType(ifGoTo, newGoTo);
    }
  };

  const setGoToTypeDecision = (ifGoTo: Boolean, decision?: DecisionTO) => {
    if (decision) {
      let newGoTo: GoTo = { type: GoToTypes.COND, id: decision.id };
      saveGoToType(ifGoTo, newGoTo);
    }
  };

  const createGoToStep = (ifGoTo: Boolean) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      let goToStep: SequenceStepCTO = new SequenceStepCTO();
      goToStep.squenceStepTO.sequenceFk = decisionToEdit.sequenceFk;
      const copyDecision: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      dispatch(EditActions.setMode.editStep(goToStep, copyDecision, ifGoTo));
    }
  };

  const createGoToDecision = (ifGoTo: Boolean) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      let goToDecision: DecisionTO = new DecisionTO();
      goToDecision.sequenceFk = decisionToEdit.sequenceFk;
      const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(decisionToEdit);
      dispatch(EditActions.setMode.editDecision(goToDecision, copyStepToEdit, ifGoTo));
      setKey(key + 1);
    }
  };

  const setRoot = () => {
    if (!isNullOrUndefined(decisionToEdit)) {
      let copySequence: SequenceCTO = Carv2Util.deepCopy(selectedSequence);
      copySequence.sequenceStepCTOs.map((step) => (step.squenceStepTO.root = false));
      copySequence.decisions.map((cond) => (cond.root = false));
      copySequence.sequenceStepCTOs.forEach((step) => dispatch(EditActions.step.save(step)));
      copySequence.decisions.forEach((cond) => dispatch(EditActions.decision.save(cond)));
      let copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.root = true;
      dispatch(EditActions.decision.save(copyDecisionToEdit));
      dispatch(EditActions.decision.update(copyDecisionToEdit));
    }
  };

  // This is workaround sins redux seams to have a problem to save boolean values.
  const getDecision = (): number => {
    let hasNumber: number = 2;
    if (!isNullOrUndefined(decisionToEdit)) {
      hasNumber = decisionToEdit.has ? 1 : 2;
    }
    return hasNumber;
  };

  return {
    label: "EDIT SEQUENCE - DECISION",
    name: decisionToEdit?.name,
    changeName,
    saveDecision,
    setComponent,
    textInput,
    validStep,
    compId: decisionToEdit?.componentFk,
    updateDecision,
    deleteDecision,
    setData,
    datas: decisionToEdit?.dataFks || [],
    setHas,
    handleType,
    setGoToTypeStep,
    setGoToTypeDecision,
    ifGoTo: currentIfGoTo,
    elseGoTo: currentElseGoTo,
    createGoToStep,
    createGoToDecision,
    setRoot,
    isRoot: decisionToEdit?.root ? decisionToEdit.root : false,
    getDecision,
    key,
  };
};
