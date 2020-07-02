import React, { FunctionComponent, useEffect, useRef, useState } from "react";
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
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ActionDropDown } from "../../../../../common/fragments/dropdowns/ActionDropDown";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancelCheckBox } from "../common/fragments/Carv2SubmitCancel";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditStepProps {}

export const ControllPanelEditStep: FunctionComponent<ControllPanelEditStepProps> = (props) => {
  const {
    label,
    name,
    cancel,
    changeName,
    deleteSequenceStep,
    saveSequenceStep,
    showDelete,
    textInput,
    toggleIsCreateAnother,
    setComponent,
    validStep,
    editOrAddAction,
    sourceCompId,
    targetCompId,
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
          />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField>
          <ComponentDropDown onSelect={(comp) => setComponent(comp, true)} value={sourceCompId} />
          <ComponentDropDown onSelect={(comp) => setComponent(comp, false)} value={targetCompId} />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField>
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddAction()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Action
            </Button>
            <ActionDropDown onSelect={editOrAddAction} icon={"wrench"} />
          </Button.Group>
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => {}} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Conditions
            </Button>
            <Button icon="wrench" inverted color="orange" onClick={() => {}} />
            {/* TODO: condition dropdown. */}
          </Button.Group>
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2SubmitCancelCheckBox
          onSubmit={saveSequenceStep}
          onCancel={cancel}
          onChange={toggleIsCreateAnother}
          toggleLabel="Edit next"
          submitCondition={validStep()}
        />
        {showDelete && <Carv2DeleteButton onClick={deleteSequenceStep} />}
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditSequenceStepViewModel = () => {
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const dispatch = useDispatch();
  const [isEditNext, setIsEditNext] = useState<boolean>(false);
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
    if (!isNullOrUndefined(stepToEdit)) {
      dispatch(EditActions.step.save(stepToEdit));
      dispatch(EditActions.setMode.editSequence(stepToEdit.squenceStepTO.sequenceFk));
      // if (isEditNext) {
      //   if (sequenceStepToEdit.squenceStepTO.index < sequenceToEdit.sequenceStepCTOs.length) {
      //     dispatch(
      //       EditActions.setMode.editStep(
      //         sequenceToEdit.sequenceStepCTOs.find(
      //           (step) => step.squenceStepTO.id === sequenceStepToEdit.squenceStepTO.index + 1
      //         )
      //       )
      //     );
      //   } else {
      //     dispatch(EditActions.setMode.editStep());
      //   }
    } else {
      dispatch(EditActions.setMode.edit());
    }
  };

  const deleteSequenceStep = () => {
    if (!isNullOrUndefined(stepToEdit)) {
      dispatch(EditActions.step.delete(stepToEdit));
      dispatch(EditActions.setMode.editSequence(stepToEdit.squenceStepTO.sequenceFk));
    }
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
        stepToEdit.squenceStepTO.name !== "" &&
        stepToEdit.squenceStepTO.sourceComponentFk !== -1 &&
        stepToEdit.squenceStepTO.targetComponentFk !== -1
      ) {
        valid = true;
      }
    }
    return valid;
  };

  const cancel = (): void => {
    if (!isNullOrUndefined(stepToEdit)) {
      dispatch(EditActions.setMode.editSequence(stepToEdit.squenceStepTO.sequenceFk));
    }
  };

  return {
    label: stepToEdit ? "EDIT SEQUENCE STEP" : "ADD SEQUENCE STEP",
    name: stepToEdit ? stepToEdit!.squenceStepTO.name : "",
    changeName,
    saveSequenceStep,
    deleteSequenceStep,
    setComponent,
    cancel,
    toggleIsCreateAnother: () => setIsEditNext(!isEditNext),
    textInput,
    showDelete: stepToEdit?.squenceStepTO.id !== -1 ? true : false,
    validStep,
    editOrAddAction,
    sourceCompId: stepToEdit?.squenceStepTO.sourceComponentFk,
    targetCompId: stepToEdit?.squenceStepTO.targetComponentFk,
  };
};
