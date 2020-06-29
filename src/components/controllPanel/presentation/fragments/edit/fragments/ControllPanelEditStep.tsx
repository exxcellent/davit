import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, DropdownItemProps, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../../../../dataAccess/access/to/ActionTO";
import { EditActions } from "../../../../../../slices/EditSlice";
import { GlobalActions, handleError } from "../../../../../../slices/GlobalSlice";
import { currentSequence, currentStep, SequenceActions } from "../../../../../../slices/SequenceSlice";
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
    indexToOptions,
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
          <Dropdown
            options={indexToOptions()}
            selection
            compact
            onChange={(event, data) => changeIndex(Number(data.value))}
            value={index}
          />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField>
          <ComponentDropDown onSelect={(comp) => setComponent(comp, true)} value={sourceCompId} />
          <ComponentDropDown onSelect={(comp) => setComponent(comp, false)} value={targetCompId} />
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Button.Group>
          <Button icon="add" inverted color="orange" onClick={() => editOrAddAction()} />
          <Button id="buttonGroupLabel" disabled inverted color="orange">
            Action
          </Button>
          <ActionDropDown onSelect={editOrAddAction} icon={"wrench"} />
        </Button.Group>
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
  const sequenceToEdit: SequenceCTO | null = useSelector(currentSequence);
  const sequenceStepToEdit: SequenceStepCTO | null = useSelector(currentStep);
  const dispatch = useDispatch();
  const [isEditNext, setIsEditNext] = useState<boolean>(false);
  const textInput = useRef<Input>(null);

  useEffect(() => {
    if (isNullOrUndefined(sequenceStepToEdit)) {
      GlobalActions.setModeToEdit();
      handleError("Tried to go to edit sequence step without sequenceStepToEdit specified");
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [sequenceStepToEdit]);

  const indexToOptions = (): DropdownItemProps[] => {
    if (sequenceToEdit) {
      return Array.from(Array(sequenceToEdit.sequenceStepCTOs.length).keys()).map((index) => {
        return {
          key: index + 1,
          value: index + 1,
          text: index + 1,
        };
      });
    }
    return [];
  };

  const changeName = (name: string) => {
    if (!isNullOrUndefined(sequenceStepToEdit)) {
      const copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(sequenceStepToEdit);
      copySequenceStep.squenceStepTO.name = name;
      dispatch(SequenceActions.updateCurrentSequenceStep(copySequenceStep));
    }
  };

  const changeIndex = (index: number) => {
    if (!isNullOrUndefined(sequenceStepToEdit)) {
      const copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(sequenceStepToEdit);
      copySequenceStep.squenceStepTO.index = index;
      dispatch(SequenceActions.updateCurrentSequenceStep(copySequenceStep));
    }
  };

  const setComponent = (component: ComponentCTO | undefined, isSource?: boolean) => {
    if (component !== undefined && !isNullOrUndefined(sequenceStepToEdit)) {
      const copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(sequenceStepToEdit);
      if (isSource) {
        copySequenceStep.squenceStepTO.sourceComponentFk = component.component.id;
      } else {
        copySequenceStep.squenceStepTO.targetComponentFk = component.component.id;
      }
      dispatch(SequenceActions.updateCurrentSequenceStep(copySequenceStep));
    }
  };

  const saveSequenceStep = () => {
    if (!isNullOrUndefined(sequenceToEdit) && !isNullOrUndefined(sequenceStepToEdit)) {
      dispatch(SequenceActions.saveSequence(sequenceToEdit));
      if (isEditNext) {
        if (sequenceStepToEdit.squenceStepTO.index < sequenceToEdit.sequenceStepCTOs.length) {
          dispatch(GlobalActions.setModeToEditStep(sequenceStepToEdit.squenceStepTO.index + 1));
        } else {
          dispatch(GlobalActions.setModeToEditStep());
        }
      } else {
        dispatch(GlobalActions.setModeToEditCurrentSequence(sequenceToEdit));
      }
    }
  };

  const deleteSequenceStep = () => {
    if (!isNullOrUndefined(sequenceToEdit) && !isNullOrUndefined(sequenceStepToEdit)) {
      dispatch(SequenceActions.deleteSequenceStep(sequenceStepToEdit));
      dispatch(SequenceActions.updateCurrentSequnceToEdit(sequenceToEdit));
    }
  };

  const editOrAddAction = (action?: ActionTO) => {
    if (!isNullOrUndefined(sequenceToEdit) && !isNullOrUndefined(sequenceStepToEdit)) {
      dispatch(EditActions.setMode.editAction(action));
    }
  };

  const validStep = (): boolean => {
    let valid: boolean = false;
    if (!isNullOrUndefined(sequenceStepToEdit) && !isNullOrUndefined(sequenceToEdit)) {
      if (
        sequenceStepToEdit.squenceStepTO.name !== "" &&
        sequenceStepToEdit.squenceStepTO.sourceComponentFk !== -1 &&
        sequenceStepToEdit.squenceStepTO.targetComponentFk !== -1
      ) {
        valid = true;
      }
    }
    return valid;
  };

  const cancel = (): void => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      dispatch(GlobalActions.setModeToEditCurrentSequence(sequenceToEdit));
    }
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
    cancel,
    toggleIsCreateAnother: () => setIsEditNext(!isEditNext),
    textInput,
    showDelete: sequenceStepToEdit?.squenceStepTO.id !== -1 ? true : false,
    indexToOptions,
    validStep,
    editOrAddAction,
    sourceCompId: sequenceStepToEdit?.squenceStepTO.sourceComponentFk,
    targetCompId: sequenceStepToEdit?.squenceStepTO.targetComponentFk,
  };
};
