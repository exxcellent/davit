import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { DecisionTO } from "../../../../../../dataAccess/access/to/DecisionTO";
import { SequenceTO } from "../../../../../../dataAccess/access/to/SequenceTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { DecisionDropDownButton } from "../../../../../common/fragments/dropdowns/DecisionDropDown";
import { StepDropDownButton } from "../../../../../common/fragments/dropdowns/StepDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditSequenceProps {
  hidden: boolean;
}

export const ControllPanelEditSequence: FunctionComponent<ControllPanelEditSequenceProps> = (props) => {
  const { hidden } = props;
  const {
    label,
    name,
    textInput,
    changeName,
    deleteSequence,
    saveSequence,
    editOrAddSequenceStep,
    createAnother,
    updateSequence,
    editOrAddDecision,
  } = useControllPanelEditSequenceViewModel();

  const menuButtons = (
    <div className="columnDivider controllPanelEditChild">
      <OptionField label="Navigation">
        <Carv2ButtonLabel onClick={createAnother} label="Create another" />
        <Carv2ButtonIcon onClick={saveSequence} icon="reply" />
      </OptionField>
      <OptionField label="Sequence - Options">
        <Carv2DeleteButton onClick={deleteSequence} />
      </OptionField>
    </div>
  );

  return (
    <ControllPanelEditSub label={label} hidden={hidden} onClickNavItem={saveSequence}>
      <div className="controllPanelEditChild">
        <OptionField label="Sequence - name">
          <Carv2LabelTextfield
            label="Name:"
            placeholder="Sequence Name..."
            onChange={(event: any) => changeName(event.target.value)}
            value={name}
            autoFocus
            ref={textInput}
            onBlur={() => updateSequence()}
            unvisible={hidden}
          />
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <OptionField label="Create / Edit | Sequence - Step">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddSequenceStep()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Step
            </Button>
            <StepDropDownButton onSelect={editOrAddSequenceStep} icon="wrench" />
          </Button.Group>
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <OptionField label="Create / Edit | Sequence - Decision">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddDecision()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Decision
            </Button>
            <DecisionDropDownButton onSelect={editOrAddDecision} icon="wrench" />
          </Button.Group>
        </OptionField>
      </div>
      {menuButtons}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditSequenceViewModel = () => {
  const sequenceToEdit: SequenceTO | null = useSelector(editSelectors.sequenceToEdit);
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
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
      dispatch(EditActions.sequence.save(copySequenceToEdit));
    }
  };

  const saveSequence = () => {
    if (sequenceToEdit!.name !== "") {
      dispatch(EditActions.sequence.save(sequenceToEdit!));
    } else {
      dispatch(EditActions.sequence.delete(sequenceToEdit!));
    }
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

  const validateInput = (): boolean => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      return Carv2Util.isValidName(sequenceToEdit.name);
    } else {
      return false;
    }
  };

  const editOrAddSequenceStep = (step?: SequenceStepCTO) => {
    let stepToEdit: SequenceStepCTO | undefined = step;
    if (stepToEdit === undefined) {
      stepToEdit = new SequenceStepCTO();
      stepToEdit.squenceStepTO.sequenceFk = sequenceToEdit?.id || -1;
      stepToEdit.squenceStepTO.root = isFirst();
    }
    dispatch(EditActions.setMode.editStep(stepToEdit));
  };

  const editOrAddDecision = (decision?: DecisionTO) => {
    let decisionToEdit: DecisionTO | undefined = decision;
    if (decisionToEdit === undefined) {
      decisionToEdit = new DecisionTO();
      decisionToEdit.sequenceFk = sequenceToEdit?.id || -1;
      decisionToEdit.root = isFirst();
    }
    dispatch(EditActions.setMode.editDecision(decisionToEdit));
  };

  const isFirst = (): boolean => {
    return selectedSequence?.sequenceStepCTOs.length === 0 && selectedSequence.decisions.length === 0 ? true : false;
  };

  const copySequence = () => {
    let copySequence: SequenceTO = Carv2Util.deepCopy(sequenceToEdit);
    copySequence.name = sequenceToEdit?.name + "-copy";
    copySequence.id = -1;
    dispatch(EditActions.sequence.update(copySequence));
  };

  const createAnother = () => {
    dispatch(EditActions.setMode.editSequence());
  };

  const updateSequence = () => {
    let copySequence: SequenceTO = Carv2Util.deepCopy(sequenceToEdit);
    dispatch(EditActions.sequence.save(copySequence));
  };

  return {
    label: "EDIT * " + (sequenceToEdit?.name || ""),
    name: sequenceToEdit?.name,
    changeName,
    saveSequence,
    deleteSequence,
    textInput,
    editOrAddSequenceStep,
    validateInput,
    copySequence,
    createAnother,
    updateSequence,
    editOrAddDecision,
  };
};
