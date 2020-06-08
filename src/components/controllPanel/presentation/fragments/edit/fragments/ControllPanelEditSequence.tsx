import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { GlobalActions, handleError } from "../../../../../../slices/GlobalSlice";
import { currentSequence, SequenceActions } from "../../../../../../slices/SequenceSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { useGetStepDropDown } from "../common/fragments/Carv2DropDown";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "../common/fragments/Carv2SubmitCancel";

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
    showDelete,
    toggleIsCreateAnother,
    editOrAddSequenceStep,
    validateInput,
  } = useControllPanelEditSequenceViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Sequence Name"
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
      />
      <div className="columnDivider controllPanelEditChild">
        <Button.Group>
          <Button icon="add" inverted color="orange" onClick={() => editOrAddSequenceStep()} />
          <Button id="buttonGroupLabel" disabled inverted color="orange">
            Step
          </Button>
          {useGetStepDropDown((step) => editOrAddSequenceStep(step?.squenceStepTO.index), "wrench")}
        </Button.Group>
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2SubmitCancel
          onSubmit={saveSequence}
          onCancel={cancel}
          onChange={toggleIsCreateAnother}
          submitCondition={validateInput()}
        />
      </div>
      {showDelete && (
        <div className="columnDivider controllPanelEditChild">
          <Carv2DeleteButton onClick={deleteSequence} />
        </div>
      )}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditSequenceViewModel = () => {
  const sequenceToEdit: SequenceCTO | null = useSelector(currentSequence);
  console.log("edit Sequence currentSequence: " + sequenceToEdit);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // check if sequence to edit is really set or gos back to edit mode
    if (isNullOrUndefined(sequenceToEdit)) {
      GlobalActions.setModeToEdit();
      handleError("Tried to go to edit sequence without sequenceToedit specified");
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
    // TODO: kann dass evtl der global slice machen?
    dispatch(SequenceActions.setSequenceToEdit(null));
    if (isCreateAnother) {
      dispatch(GlobalActions.setModeToEditSequence());
    } else {
      dispatch(GlobalActions.setModeToEdit());
    }
  };

  const deleteSequence = () => {
    dispatch(SequenceActions.deleteSequence(sequenceToEdit!));
    // TODO: kann dass evtl der global slice machen?
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

  return {
    label: sequenceToEdit?.sequenceTO.id === -1 ? "ADD SEQUENCE" : "EDIT SEQUENCE",
    name: sequenceToEdit?.sequenceTO.name,
    changeName,
    saveSequence,
    deleteSequence,
    cancel: cancelEditSequence,
    toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
    textInput,
    showDelete: sequenceToEdit?.sequenceTO.id !== -1,
    editOrAddSequenceStep: (step?: number) => dispatch(GlobalActions.setModeToEditStep(step)),
    validateInput,
  };
};
