import React, { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../../../../dataAccess/access/to/ActionTO";
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
    validStep,
    editOrAddAction,
    sourceCompId,
    targetCompId,
    createAnother,
    updateStep,
  } = useControllPanelEditSequenceStepViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <div className="controllPanelEditChild">
        <OptionField>
          <Carv2LabelTextfield
            label="Name:"
            placeholder="Step Name"
            onChange={(event: any) => changeName(event.target.value)}
            value={name}
            autoFocus
            ref={textInput}
            onBlur={() => updateStep()}
          />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField>
          <ComponentDropDown
            onSelect={(comp) => {
              setComponent(comp, true);
              updateStep();
            }}
            value={sourceCompId}
          />
          <ComponentDropDown
            onSelect={(comp) => {
              setComponent(comp, false);
              updateStep();
            }}
            value={targetCompId}
          />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField>
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
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2ButtonLabel onClick={createAnother} label="Create another" />
        <Carv2ButtonLabel onClick={saveSequenceStep} label="OK" />
        <OptionField>
          <Carv2DeleteButton onClick={deleteSequenceStep} />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditSequenceStepViewModel = () => {
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);

  useEffect(() => {
    if (isNullOrUndefined(stepToEdit)) {
      handleError("Tried to go to edit sequence step without sequenceStepToEdit specified");
      dispatch(EditActions.setMode.edit());
    }
    // set inital index
    if (stepToEdit !== null && selectedSequence !== null) {
      const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      if (stepToEdit.squenceStepTO.sequenceFk === -1) {
        copyStepToEdit.squenceStepTO.sequenceFk = selectedSequence.sequenceTO.id;
      }
      dispatch(EditActions.step.update(copyStepToEdit));
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dispatch]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(stepToEdit)) {
      const copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      copySequenceStep.squenceStepTO.name = name;
      dispatch(EditActions.setMode.editStep(copySequenceStep));
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
      dispatch(EditActions.setMode.editSequence(stepToEdit.squenceStepTO.sequenceFk));
      // }
    }
  };

  const deleteSequenceStep = () => {
    if (!isNullOrUndefined(stepToEdit)) {
      dispatch(EditActions.step.delete(stepToEdit));
      dispatch(EditActions.setMode.editSequence(stepToEdit.squenceStepTO.sequenceFk));
    }
  };

  const updateStep = () => {
    const copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
    dispatch(EditActions.step.save(copySequenceStep));
  };

  const editOrAddAction = (action?: ActionTO) => {
    if (!isNullOrUndefined(stepToEdit)) {
      dispatch(EditActions.setMode.editAction(action));
    }
  };

  const validStep = (): boolean => {
    let valid: boolean = false;
    if (!isNullOrUndefined(stepToEdit)) {
      if (
        stepToEdit.squenceStepTO.name !== ""
        // TODO: for condition development purpose.
        // && stepToEdit.squenceStepTO.sourceComponentFk !== -1 &&
        // stepToEdit.squenceStepTO.targetComponentFk !== -1
      ) {
        valid = true;
      }
    }
    return valid;
  };

  const createAnother = () => {
    // TODO fill.
  };

  return {
    label: "EDIT SEQUENCE STEP",
    name: stepToEdit ? stepToEdit!.squenceStepTO.name : "",
    changeName,
    saveSequenceStep,
    deleteSequenceStep,
    setComponent,
    textInput,
    validStep,
    editOrAddAction,
    sourceCompId: stepToEdit?.squenceStepTO.sourceComponentFk,
    targetCompId: stepToEdit?.squenceStepTO.targetComponentFk,
    createAnother,
    updateStep,
  };
};
