import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../../../../dataAccess/access/to/ActionTO";
import { DecisionTO } from "../../../../../../dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes } from "../../../../../../dataAccess/access/types/GoToType";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ActionDropDown } from "../../../../../common/fragments/dropdowns/ActionDropDown";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { DecisionDropDown } from "../../../../../common/fragments/dropdowns/DecisionDropDown";
import { GoToOptionDropDown } from "../../../../../common/fragments/dropdowns/GoToOptionDropDown";
import { StepDropDown } from "../../../../../common/fragments/dropdowns/StepDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditStepProps {}

export const ControllPanelEditStep: FunctionComponent<ControllPanelEditStepProps> = (props) => {
  const {
    label,
    name,
    changeName,
    deleteSequenceStep,
    saveSequenceStep,
    textInput,
    setComponent,
    editOrAddAction,
    sourceCompId,
    targetCompId,
    updateStep,
    handleType,
    setGoToTypeStep,
    goTo,
    setGoToTypeDecision,
    createGoToStep,
    createGoToDecision,
    setRoot,
    isRoot,
    key,
  } = useControllPanelEditSequenceStepViewModel();

  const actionDropdown = (
    <OptionField label="Create / Edit | Step - Action">
      <Button.Group>
        <Button
          icon="add"
          inverted
          color="orange"
          onClick={() => {
            editOrAddAction();
            updateStep();
          }}
        />
        <Button id="buttonGroupLabel" disabled inverted color="orange">
          Action
        </Button>
        <ActionDropDown
          onSelect={(action) => {
            editOrAddAction(action);
            updateStep();
          }}
          icon={"wrench"}
        />
      </Button.Group>
    </OptionField>
  );

  const stepName = (
    <OptionField label="Step - name">
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Step Name ..."
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
        onBlur={() => updateStep()}
      />
    </OptionField>
  );

  const sourceTargetDropDowns = (
    <div className="optionFieldSpacer columnDivider">
      <OptionField>
        <OptionField label="Select sending Component">
          <ComponentDropDown
            onSelect={(comp) => {
              setComponent(comp, true);
              updateStep();
            }}
            value={sourceCompId}
          />
        </OptionField>
        <OptionField label="Select reciving component">
          <ComponentDropDown
            onSelect={(comp) => {
              setComponent(comp, false);
              updateStep();
            }}
            value={targetCompId}
          />
        </OptionField>
      </OptionField>
    </div>
  );

  const menuButtons = (
    <div className="columnDivider controllPanelEditChild">
      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <OptionField label="Navigation">
          <Carv2ButtonIcon onClick={saveSequenceStep} icon="reply" />
        </OptionField>
      </div>
      <OptionField label="Sequence - Options">
        <Carv2ButtonLabel onClick={setRoot} label={isRoot ? "Root" : "Set as Root"} disable={isRoot} />
        <div>
          <Carv2DeleteButton onClick={deleteSequenceStep} />
        </div>
      </OptionField>
    </div>
  );

  return (
    <ControllPanelEditSub label={label} key={key}>
      <div className="controllPanelEditChild">
        {stepName}
        {actionDropdown}
      </div>
      {sourceTargetDropDowns}
      <div className="optionFieldSpacer columnDivider">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <OptionField label="Select type of the next element">
            <GoToOptionDropDown onSelect={handleType} value={goTo ? goTo.type : GoToTypes.ERROR} />
          </OptionField>
          {goTo!.type === GoToTypes.STEP && (
            <OptionField label="Create or Select next step">
              <Carv2ButtonIcon icon="add" onClick={createGoToStep} />
              <StepDropDown onSelect={setGoToTypeStep} value={goTo?.type === GoToTypes.STEP ? goTo.id : 1} />
            </OptionField>
          )}
          {goTo!.type === GoToTypes.COND && (
            <OptionField label="Create or Select next decision">
              <Carv2ButtonIcon icon="add" onClick={createGoToDecision} />
              <DecisionDropDown onSelect={setGoToTypeDecision} value={goTo?.type === GoToTypes.COND ? goTo.id : 1} />
            </OptionField>
          )}
        </div>
      </div>
      {menuButtons}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditSequenceStepViewModel = () => {
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);
  const [currentGoTo, setCurrentGoTo] = useState<GoTo>({ type: GoToTypes.STEP, id: -1 });
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    if (isNullOrUndefined(stepToEdit)) {
      handleError("Tried to go to edit sequence step without sequenceStepToEdit specified");
      dispatch(EditActions.setMode.edit());
    }
    if (stepToEdit) {
      setCurrentGoTo(stepToEdit.squenceStepTO.goto);
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dispatch, stepToEdit]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(stepToEdit)) {
      const copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      copySequenceStep.squenceStepTO.name = name;
      dispatch(EditActions.setMode.editStep(copySequenceStep));
      dispatch(EditActions.step.save(copySequenceStep));
      dispatch(SequenceModelActions.setCurrentSequence(copySequenceStep.squenceStepTO.sequenceFk));
    }
  };

  const setComponent = (component: ComponentCTO | undefined, isSource?: boolean) => {
    if (component !== undefined && !isNullOrUndefined(stepToEdit)) {
      const copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      if (isSource) {
        copySequenceStep.squenceStepTO.sourceComponentFk = component.component.id;
      } else {
        copySequenceStep.squenceStepTO.targetComponentFk = component.component.id;
      }
      dispatch(EditActions.setMode.editStep(copySequenceStep));
    }
  };

  const saveSequenceStep = () => {
    if (!isNullOrUndefined(stepToEdit) && !isNullOrUndefined(selectedSequence)) {
      dispatch(EditActions.step.save(stepToEdit));
      dispatch(EditActions.setMode.editSequence(stepToEdit.squenceStepTO.sequenceFk));
    }
  };

  const deleteSequenceStep = () => {
    if (!isNullOrUndefined(stepToEdit) && !isNullOrUndefined(selectedSequence)) {
      dispatch(EditActions.step.delete(stepToEdit, selectedSequence));
      dispatch(EditActions.setMode.editSequence(stepToEdit.squenceStepTO.sequenceFk));
    }
  };

  const updateStep = () => {
    const copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
    dispatch(EditActions.step.save(copySequenceStep));
  };

  const editOrAddAction = (action?: ActionTO) => {
    if (!isNullOrUndefined(stepToEdit)) {
      let copyAction: ActionTO | undefined = Carv2Util.deepCopy(action);
      if (copyAction === undefined) {
        copyAction = new ActionTO();
        copyAction.sequenceStepFk = stepToEdit.squenceStepTO.id;
        dispatch(EditActions.action.create(copyAction));
      } else {
        dispatch(EditActions.setMode.editAction(copyAction));
      }
    }
  };

  const validStep = (): boolean => {
    let valid: boolean = false;
    if (!isNullOrUndefined(stepToEdit)) {
      if (stepToEdit.squenceStepTO.name !== "") {
        valid = true;
      }
    }
    return valid;
  };

  const saveGoToType = (goTo: GoTo) => {
    if (goTo !== undefined) {
      const copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      copySequenceStep.squenceStepTO.goto = goTo;
      dispatch(EditActions.step.update(copySequenceStep));
      dispatch(EditActions.step.save(copySequenceStep));
      dispatch(SequenceModelActions.setCurrentSequence(copySequenceStep.squenceStepTO.sequenceFk));
    }
  };

  const handleType = (newGoToType?: string) => {
    if (newGoToType !== undefined) {
      const gType = { type: (GoToTypes as any)[newGoToType] };
      setCurrentGoTo(gType);
      switch (newGoToType) {
        case GoToTypes.ERROR:
          saveGoToType(gType);
          break;
        case GoToTypes.FIN:
          saveGoToType(gType);
          break;
      }
    }
  };

  const setGoToTypeStep = (step?: SequenceStepCTO) => {
    if (step) {
      let newGoTo: GoTo = { type: GoToTypes.STEP, id: step.squenceStepTO.id };
      saveGoToType(newGoTo);
    }
  };

  const setGoToTypeDecision = (decision?: DecisionTO) => {
    if (decision) {
      let newGoTo: GoTo = { type: GoToTypes.COND, id: decision.id };
      saveGoToType(newGoTo);
    }
  };

  const createGoToStep = () => {
    if (!isNullOrUndefined(stepToEdit)) {
      let goToStep: SequenceStepCTO = new SequenceStepCTO();
      goToStep.squenceStepTO.sequenceFk = stepToEdit.squenceStepTO.sequenceFk;
      const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      setKey(key + 1);
      dispatch(EditActions.setMode.editStep(goToStep, copyStepToEdit));
      dispatch(SequenceModelActions.setCurrentSequence(goToStep.squenceStepTO.sequenceFk));
    }
  };

  const createGoToDecision = () => {
    if (!isNullOrUndefined(stepToEdit)) {
      let goToDecision: DecisionTO = new DecisionTO();
      goToDecision.sequenceFk = stepToEdit.squenceStepTO.sequenceFk;
      const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      dispatch(EditActions.setMode.editDecision(goToDecision, copyStepToEdit));
    }
  };

  //TODO: das hat hier nicht verloren. Das ist Aufgabe vom Slice. Außerdem können wir auf keinen Fall jeden Step und jede Decision einzeln ans Backend schicken. DAs muss in einer bzw zwie Calls passieren
  const setRoot = () => {
    if (!isNullOrUndefined(stepToEdit)) {
      let copySequence: SequenceCTO = Carv2Util.deepCopy(selectedSequence);
      copySequence.sequenceStepCTOs.forEach((step) => (step.squenceStepTO.root = false));
      copySequence.decisions.forEach((cond) => (cond.root = false));
      copySequence.sequenceStepCTOs.forEach((step) => dispatch(EditActions.step.save(step)));
      copySequence.decisions.forEach((cond) => dispatch(EditActions.decision.save(cond)));
      let copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      copyStepToEdit.squenceStepTO.root = true;
      dispatch(EditActions.step.save(copyStepToEdit));
      dispatch(EditActions.step.update(copyStepToEdit));
    }
  };

  return {
    label: "EDIT SEQUENCE - EDIT STEP",
    name: stepToEdit ? stepToEdit!.squenceStepTO.name : "",
    changeName,
    saveSequenceStep,
    deleteSequenceStep,
    setComponent,
    textInput,
    validStep,
    editOrAddAction,
    sourceCompId:
      stepToEdit?.squenceStepTO.sourceComponentFk !== -1 ? stepToEdit?.squenceStepTO.sourceComponentFk : undefined,
    targetCompId:
      stepToEdit?.squenceStepTO.targetComponentFk !== -1 ? stepToEdit?.squenceStepTO.targetComponentFk : undefined,
    updateStep,
    handleType,
    goTo: currentGoTo,
    setGoToTypeStep,
    setGoToTypeDecision,
    createGoToStep,
    createGoToDecision,
    setRoot,
    isRoot: stepToEdit?.squenceStepTO.root ? stepToEdit?.squenceStepTO.root : false,
    key,
  };
};
