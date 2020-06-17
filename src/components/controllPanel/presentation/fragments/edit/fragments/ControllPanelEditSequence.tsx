import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { GlobalActions, handleError } from "../../../../../../slices/GlobalSlice";
import { currentSequence, SequenceActions } from "../../../../../../slices/SequenceSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2Button } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { useGetStepDropDown } from "../common/fragments/Carv2DropDown";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel, Carv2SubmitCancelNoCheckBox } from "../common/fragments/Carv2SubmitCancel";

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
    sequencesDropdown,
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
            {sequencesDropdown}
          </Button.Group>
        )}
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        {!showExistingOptions && (
          <Carv2SubmitCancel
            onSubmit={saveSequence}
            onCancel={cancel}
            onChange={toggleIsCreateAnother}
            submitCondition={validateInput()}
          />
        )}
        {showExistingOptions && (
          <Carv2SubmitCancelNoCheckBox
            onSubmit={saveSequence}
            onCancel={cancel}
            onChange={toggleIsCreateAnother}
            submitCondition={validateInput()}
          />
        )}
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
  const sequenceToEdit: SequenceCTO | null = useSelector(currentSequence);
  console.log("edit Sequence currentSequence: " + sequenceToEdit);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // check if sequence to edit is really set or gos back to edit mode
    if (isNullOrUndefined(sequenceToEdit)) {
      GlobalActions.setModeToEdit();
      handleError("Tried to go to edit sequence without sequenceToedit specified");
    }
    if (sequenceToEdit?.sequenceTO.id !== -1) {
      setIsCreateAnother(false);
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [sequenceToEdit]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      let copySequenceToEdit: SequenceCTO = Carv2Util.deepCopy(sequenceToEdit);
      copySequenceToEdit.sequenceTO.name = name;
      dispatch(SequenceActions.setSequenceToEdit(copySequenceToEdit));
    }
  };

  const saveSequence = () => {
    dispatch(SequenceActions.saveSequence(sequenceToEdit!));
    dispatch(SequenceActions.setSequenceToEdit(null));
    if (isCreateAnother) {
      dispatch(GlobalActions.setModeToEditSequence());
    } else {
      dispatch(GlobalActions.setModeToEdit());
    }
  };

  const deleteSequence = () => {
    dispatch(SequenceActions.deleteSequence(sequenceToEdit!));
    dispatch(SequenceActions.setSequenceToEdit(null));
    dispatch(GlobalActions.setModeToEdit());
  };

  const cancelEditSequence = () => {
    dispatch(SequenceActions.setSequenceToEdit(null));
    dispatch(GlobalActions.setModeToEdit());
  };

  const validateInput = (): boolean => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      return Carv2Util.isValidName(sequenceToEdit.sequenceTO.name);
    } else {
      return false;
    }
  };

  const editOrAddSequenceStep = (step?: number) => {
    dispatch(GlobalActions.setModeToEditStep(step));
  };

  const copySequence = () => {
    let copySequence: SequenceCTO = Carv2Util.deepCopy(sequenceToEdit);
    copySequence.sequenceTO.name = "copy-" + sequenceToEdit?.sequenceTO.name;
    copySequence.sequenceTO.id = -1;
    copySequence.sequenceStepCTOs.map((step) => {
      step.squenceStepTO.id = -1;
      step.squenceStepTO.sequenceFk = -1;
    });
    dispatch(GlobalActions.setModeToEditSequence(copySequence));
  };

  return {
    label: sequenceToEdit?.sequenceTO.id === -1 ? "ADD SEQUENCE" : "EDIT SEQUENCE",
    name: sequenceToEdit?.sequenceTO.name,
    changeName,
    saveSequence,
    deleteSequence,
    cancel: cancelEditSequence,
    toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
    textInput,
    showExistingOptions: sequenceToEdit?.sequenceTO.id !== -1,
    editOrAddSequenceStep,
    validateInput,
    sequencesDropdown: useGetStepDropDown((step) => editOrAddSequenceStep(step?.squenceStepTO.index), "wrench"),
    copySequence,
  };
};
