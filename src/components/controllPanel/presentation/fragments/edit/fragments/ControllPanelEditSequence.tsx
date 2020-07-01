import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { SequenceTO } from "../../../../../../dataAccess/access/to/SequenceTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2Button } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { StepDropDown } from "../../../../../common/fragments/dropdowns/StepDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancelCheckBox } from "../common/fragments/Carv2SubmitCancel";

export interface ControllPanelEditSequenceProps {}

export const ControllPanelEditSequence: FunctionComponent<ControllPanelEditSequenceProps> = (props) => {
  const {
    label,
    name,
    textInput,
    cancel,
    changeName,
    deleteSequence,
    saveSequence,
    showExistingOptions,
    toggleIsCreateAnother,
    editOrAddSequenceStep,
    validateInput,
    copySequence,
  } = useControllPanelEditSequenceViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <div className="controllPanelEditChild">
        <Carv2LabelTextfield
          label="Name:"
          placeholder="Sequence Name"
          onChange={(event: any) => changeName(event.target.value)}
          value={name}
          autoFocus
          ref={textInput}
        />
      </div>
      <div className="columnDivider controllPanelEditChild">
        {showExistingOptions && (
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddSequenceStep()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Step
            </Button>
            <StepDropDown onSelect={editOrAddSequenceStep} icon="wrench" />
          </Button.Group>
        )}
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2SubmitCancelCheckBox
          onSubmit={saveSequence}
          onCancel={cancel}
          onChange={toggleIsCreateAnother}
          submitCondition={validateInput()}
        />
      </div>
      {showExistingOptions && (
        <div className="controllPanelEditChild columnDivider">
          <div>
            <Carv2Button icon="copy" onClick={copySequence} />
          </div>
          <div>
            <Carv2DeleteButton onClick={deleteSequence} />
          </div>
        </div>
      )}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditSequenceViewModel = () => {
  const sequenceToEdit: SequenceTO | null = useSelector(editSelectors.sequenceToEdit);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // check if sequence to edit is really set or gos back to edit mode
    if (isNullOrUndefined(sequenceToEdit)) {
      handleError("Tried to go to edit sequence without sequenceToedit specified");
      dispatch(EditActions.setMode.edit());
    }
    if (sequenceToEdit?.id !== -1) {
      setIsCreateAnother(false);
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [sequenceToEdit, dispatch]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      let copySequenceToEdit: SequenceTO = Carv2Util.deepCopy(sequenceToEdit);
      copySequenceToEdit.name = name;
      dispatch(EditActions.sequence.update(copySequenceToEdit));
    }
  };

  const saveSequence = () => {
    dispatch(EditActions.sequence.save(sequenceToEdit!));
    if (isCreateAnother) {
      dispatch(EditActions.setMode.editSequence());
    } else {
      dispatch(EditActions.setMode.edit());
    }
  };

  const deleteSequence = () => {
    dispatch(EditActions.sequence.delete(sequenceToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const cancelEditSequence = () => {
    dispatch(EditActions.setMode.edit());
  };

  const validateInput = (): boolean => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      return Carv2Util.isValidName(sequenceToEdit.name);
    } else {
      return false;
    }
  };

  const editOrAddSequenceStep = (step?: SequenceStepCTO) => {
    dispatch(EditActions.setMode.editStep(step));
  };

  const copySequence = () => {
    let copySequence: SequenceTO = Carv2Util.deepCopy(sequenceToEdit);
    copySequence.name = sequenceToEdit?.name + "-copy";
    copySequence.id = -1;
    // TODO: need a way to copy steps as well!
    // copySequence.sequenceStepCTOs.forEach((step) => {
    //   step.squenceStepTO.id = -1;
    //   step.squenceStepTO.sequenceFk = -1;
    // });
    dispatch(EditActions.sequence.save(copySequence));
  };

  return {
    label: sequenceToEdit?.id === -1 ? "ADD SEQUENCE" : "EDIT SEQUENCE",
    name: sequenceToEdit?.name,
    changeName,
    saveSequence,
    deleteSequence,
    cancel: cancelEditSequence,
    toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
    textInput,
    showExistingOptions: sequenceToEdit?.id !== -1,
    editOrAddSequenceStep,
    validateInput,
    // sequencesDropdown: useGetStepDropDown((step) => editOrAddSequenceStep(step?.squenceStepTO.index), "wrench"),
    copySequence,
  };
};
