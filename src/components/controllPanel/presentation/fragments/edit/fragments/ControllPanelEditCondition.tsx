import React, { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { ActionTO } from "../../../../../../dataAccess/access/to/ActionTO";
import { ConditionTO } from "../../../../../../dataAccess/access/to/ConditionTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ActionDropDown } from "../../../../../common/fragments/dropdowns/ActionDropDown";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditConditionProps {}

export const ControllPanelEditCondition: FunctionComponent<ControllPanelEditConditionProps> = (props) => {
  const {
    label,
    name,
    changeName,
    saveCondition,
    textInput,
    setComponent,
    validStep,
    editOrAddAction,
    updateCondition,
    deleteCondition,
    compId,
  } = useControllPanelEditConditionViewModel();

  const actionDropdown = (
    <OptionField>
      <Button.Group>
        <Button
          icon="add"
          inverted
          color="orange"
          onClick={() => {
            editOrAddAction();
            updateCondition();
          }}
        />
        <Button id="buttonGroupLabel" disabled inverted color="orange">
          Action
        </Button>
        <ActionDropDown
          onSelect={(action) => {
            editOrAddAction(action);
            updateCondition();
          }}
          icon={"wrench"}
        />
      </Button.Group>
    </OptionField>
  );

  const stepName = (
    <OptionField>
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Step Name"
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
        onBlur={() => updateCondition()}
      />
    </OptionField>
  );

  const sourceTargetDropDowns = (
    <div className="optionFieldSpacer columnDivider">
      <OptionField>
        <ComponentDropDown
          onSelect={(comp) => {
            setComponent(comp);
            updateCondition();
          }}
          value={compId}
        />
      </OptionField>
    </div>
  );

  const menuButtons = (
    <div className="columnDivider controllPanelEditChild">
      {/* <Carv2ButtonLabel onClick={createAnother} label="Create another" /> */}
      <Carv2ButtonLabel onClick={saveCondition} label="OK" />
      <OptionField>
        <Carv2DeleteButton onClick={deleteCondition} />
      </OptionField>
    </div>
  );

  return (
    <ControllPanelEditSub label={label}>
      <div className="controllPanelEditChild">
        {stepName}
        {actionDropdown}
      </div>
      {sourceTargetDropDowns}
      <div className="optionFieldSpacer columnDivider">
        {/* <OptionField>
          <GoToOptionDropDown onSelect={handleType} value={goTo ? goTo.type : GoToTypes.ERROR} />
          {goTo!.type === GoToTypes.STEP && (
            <StepDropDown onSelect={setGoToTypeStep} value={goTo?.type === GoToTypes.STEP ? goTo.id : 1} />
          )}
          {goTo!.type === GoToTypes.COND && (
            <StepDropDown onSelect={setGoToTypeStep} value={goTo?.type === GoToTypes.COND ? goTo.id : 1} />
          )}
        </OptionField> */}
      </div>
      {menuButtons}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditConditionViewModel = () => {
  const conditionToEdit: ConditionTO | null = useSelector(editSelectors.conditionToEdit);
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);

  useEffect(() => {
    if (isNullOrUndefined(conditionToEdit)) {
      handleError("Tried to go to edit condition step without conditionToEdit specified");
      dispatch(EditActions.setMode.edit());
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dispatch, conditionToEdit]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(conditionToEdit)) {
      const copyConditionToEdit: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
      copyConditionToEdit.name = name;
      dispatch(EditActions.setMode.editCondition(copyConditionToEdit));
    }
  };

  const setComponent = (component: ComponentCTO | undefined) => {
    if (component !== undefined && !isNullOrUndefined(conditionToEdit)) {
      const copyConditionToEdit: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
      copyConditionToEdit.componentFk = component.component.id;
      dispatch(EditActions.setMode.editCondition(copyConditionToEdit));
    }
  };

  const saveCondition = () => {
    if (!isNullOrUndefined(conditionToEdit) && !isNullOrUndefined(selectedSequence)) {
      dispatch(EditActions.condition.save(conditionToEdit));
      // if (isEditNext) {
      //   if (stepToEdit.squenceStepTO.index < selectedSequence.sequenceStepCTOs.length) {
      //     dispatch(
      //       EditActions.setMode.editStep(
      //         selectedSequence.sequenceStepCTOs.find(
      //           (step) => step.squenceStepTO.id === stepToEdit.squenceStepTO.index + 1
      //         )
      //       )
      //     );
      //   } else {
      //     dispatch(EditActions.setMode.editStep());
      //   }
      // } else {
      dispatch(EditActions.setMode.editSequence(conditionToEdit.sequenceFk));
      // }
    }
  };

  const deleteCondition = () => {
    if (!isNullOrUndefined(conditionToEdit)) {
      dispatch(EditActions.condition.delete(conditionToEdit));
      dispatch(EditActions.setMode.editSequence(conditionToEdit.sequenceFk));
    }
  };

  const updateCondition = () => {
    const copyCondition: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
    dispatch(EditActions.condition.save(copyCondition));
  };

  const editOrAddAction = (action?: ActionTO) => {
    if (!isNullOrUndefined(conditionToEdit)) {
      dispatch(EditActions.setMode.editAction(action));
    }
  };

  const validStep = (): boolean => {
    let valid: boolean = false;
    if (!isNullOrUndefined(conditionToEdit)) {
      if (
        conditionToEdit.name !== ""
        // TODO: for condition development purpose.
        // && stepToEdit.squenceStepTO.sourceComponentFk !== -1 &&
        // stepToEdit.squenceStepTO.targetComponentFk !== -1
      ) {
        valid = true;
      }
    }
    return valid;
  };

  return {
    label: "EDIT CONDITION",
    name: conditionToEdit?.name,
    changeName,
    saveCondition,
    setComponent,
    textInput,
    validStep,
    editOrAddAction,
    compId: conditionToEdit?.componentFk,
    updateCondition,
    deleteCondition,
  };
};
