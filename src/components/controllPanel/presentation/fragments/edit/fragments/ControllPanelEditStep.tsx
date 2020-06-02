import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { GlobalActions, handleError } from "../../../../../../slices/GlobalSlice";
import { currentSequence, currentStep, SequenceActions } from "../../../../../../slices/SequenceSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { useGetComponentDropdown, useGetComponentDropdownLable } from "../common/fragments/Carv2DropDown";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "../common/fragments/Carv2SubmitCancel";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditStepProps {}

export const ControllPanelEditStep: FunctionComponent<ControllPanelEditStepProps> = (props) => {
  const {
    label,
    name,
    index,
    cancel,
    changeName,
    changeIndex,
    deleteSequenceStep,
    saveSequenceStep,
    showDelete,
    textInput,
    toggleIsCreateAnother,
    setComponent,
  } = useControllPanelEditSequenceStepViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <div className="controllPanelEditChild">
        <Carv2LabelTextfield
          label="Name:"
          placeholder="Step Name"
          onChange={(event: any) => changeName(event.target.value)}
          value={name}
          autoFocus
          ref={textInput}
        />
        <Carv2LabelTextfield
          label="Index:"
          placeholder="Step Index"
          onChange={(event: any) => changeIndex(Number(event.target.value))}
          value={index}
        />
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField>
          {useGetComponentDropdownLable((comp) => setComponent(comp, true), "Select Source")}
          {useGetComponentDropdownLable((comp) => setComponent(comp, false), "Select Target")}
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Button.Group>
          <Button id="buttonGroupLabel" disabled inverted color="orange">
            Component Data
          </Button>
          {useGetComponentDropdown(() => {}, "wrench")}
        </Button.Group>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2SubmitCancel onSubmit={saveSequenceStep} onCancel={cancel} onChange={toggleIsCreateAnother} />
        <Carv2DeleteButton onClick={() => {}} />
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditSequenceStepViewModel = () => {
  const sequenceStepToEdit: SequenceStepCTO | null = useSelector(currentStep);
  const sequenceToEdit: SequenceCTO | null = useSelector(currentSequence);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // check if component to edit is really set or gos back to edit mode
    if (isNullOrUndefined(sequenceStepToEdit)) {
      GlobalActions.setModeToEdit();
      handleError("Tried to go to edit sequence step without sequenceStepToEdit specified");
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [sequenceStepToEdit]);

  const changeName = (name: string) => {
    const copySequenceToEdit: SequenceCTO = Carv2Util.deepCopy(sequenceToEdit);
    let step: SequenceStepCTO | undefined = copySequenceToEdit.sequenceStepCTOs.find(
      (step) => step.squenceStepTO.index === sequenceStepToEdit?.squenceStepTO.index
    );
    if (step !== undefined) {
      step.squenceStepTO.name = name;
    } else {
      step = new SequenceStepCTO();
      step.squenceStepTO.name = name;
      dispatch(SequenceActions.setSequenceStepToEdit(step.squenceStepTO.index));
      copySequenceToEdit.sequenceStepCTOs.push(step);
    }
    dispatch(SequenceActions.setSequenceToEdit(copySequenceToEdit));
  };

  const changeIndex = (index: number) => {
    const copySequenceToEdit: SequenceCTO = Carv2Util.deepCopy(sequenceToEdit);
    let step: SequenceStepCTO | undefined = copySequenceToEdit.sequenceStepCTOs.find(
      (step) => step.squenceStepTO.index === sequenceStepToEdit?.squenceStepTO.index
    );
    if (step !== undefined) {
      step.squenceStepTO.index = index;
      dispatch(SequenceActions.setSequenceStepToEdit(step.squenceStepTO.index));
    } else {
      step = new SequenceStepCTO();
      step.squenceStepTO.index = index;
      dispatch(SequenceActions.setSequenceStepToEdit(step.squenceStepTO.index));
      copySequenceToEdit.sequenceStepCTOs.push(step);
    }
    dispatch(SequenceActions.setSequenceToEdit(copySequenceToEdit));
  };

  const setComponent = (component: ComponentCTO | undefined, isSource?: boolean) => {
    if (component !== undefined) {
      const copySequenceToEdit: SequenceCTO = Carv2Util.deepCopy(sequenceToEdit);
      let step: SequenceStepCTO | undefined = copySequenceToEdit.sequenceStepCTOs.find(
        (step) => step.squenceStepTO.index === sequenceStepToEdit?.squenceStepTO.index
      );
      if (step !== undefined) {
        isSource ? (step.componentCTOSource = component) : (step.componentCTOTarget = component);
      } else {
        step = new SequenceStepCTO();
        isSource ? (step.componentCTOSource = component) : (step.componentCTOTarget = component);
        dispatch(SequenceActions.setSequenceStepToEdit(step.squenceStepTO.index));
        copySequenceToEdit.sequenceStepCTOs.push(step);
      }
      dispatch(SequenceActions.setSequenceToEdit(copySequenceToEdit));
    }
  };

  const saveSequenceStep = () => {
    // dispatch(SequenceActions.saveSequence(sequenceToEdit!));
    // dispatch(SequenceActions.setSequenceToEdit(null));
    // if (isCreateAnother) {
    //   dispatch(GlobalActions.setModeToEditSequence());
    // } else {
    //   dispatch(GlobalActions.setModeToEdit());
    // }
  };

  const deleteSequenceStep = () => {
    // dispatch(SequenceActions.deleteSequence(sequenceToEdit!));
    // dispatch(SequenceActions.setSequenceToEdit(null));
    // dispatch(GlobalActions.setModeToEdit());
  };

  return {
    label: sequenceStepToEdit ? "EDIT SEQUENCE STEP" : "ADD SEQUENCE STEP",
    name: sequenceStepToEdit ? sequenceStepToEdit!.squenceStepTO.name : "",
    index: sequenceStepToEdit ? sequenceStepToEdit!.squenceStepTO.index : "",
    changeName,
    changeIndex,
    saveSequenceStep,
    deleteSequenceStep,
    setComponent,
    cancel: () => dispatch(GlobalActions.setModeToEditCurrentSequence()),
    toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
    textInput,
    showDelete: sequenceStepToEdit ? true : false,
  };
};
