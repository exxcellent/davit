import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { Mode } from "../../../../../../slices/GlobalSlice";
import { SequenceSlice } from "../../../../../../slices/SequenceSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelActions } from "../../../../viewModel/ControllPanelActions";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "../common/fragments/Carv2SubmitCancel";

export interface ControllPanelEditSequenceProps {}

export const ControllPanelEditSequence: FunctionComponent<ControllPanelEditSequenceProps> = (props) => {
  const { setCurrentSequence } = SequenceSlice.actions;

  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const [label, setLabel] = useState<string>("Create Sequence");
  const textInput = useRef<Input>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentSequence(sequence));
    if (sequence.sequenceTO.id !== -1) {
      setLabel("Edit Sequence");
    }
  }, [sequence, dispatch, setCurrentSequence]);

  const saveSequenceChanges = () => {
    dispatch(ControllPanelActions.saveSequence(Carv2Util.deepCopy(sequence)));
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setSequenceToEdit(null));
      dispatch(ControllPanelActions.setMode(Mode.EDIT));
    } else {
      dispatch(ControllPanelActions.setSequenceToEdit(new SequenceCTO()));
      textInput.current!.focus();
    }
  };

  const cancelEditSequence = () => {
    dispatch(setCurrentSequence(null));
    dispatch(ControllPanelActions.cancelEditSequence());
  };

  const createNewStep = () => {
    dispatch(ControllPanelActions.setSequenceStepToEdit(new SequenceStepCTO()));
    dispatch(ControllPanelActions.setMode(Mode.EDIT_SEQUENCE_STEP));
  };

  return (
    <ControllPanelEditSub label={label}>
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Sequence Name"
        onChange={(event: any) => {
          // setSequenceToEdit({
          //   ...sequence,
          //   sequenceTO: { ...sequence.sequenceTO, name: event.target.value },
          // });
        }}
        value={sequence.sequenceTO.name}
        autoFocus
        ref={textInput}
      />
      <div className="columnDivider controllPanelEditChild">
        <Button.Group>
          <Button icon="add" inverted color="orange" onClick={createNewStep} />
          <Button id="buttonGroupLabel" disabled inverted color="orange">
            Step
          </Button>
          {/* {useGetDataDropdown(() => {}, "wrench")} */}
        </Button.Group>
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2SubmitCancel
          onSubmit={saveSequenceChanges}
          onCancel={cancelEditSequence}
          onChange={() => setIsCreateAnother(!isCreateAnother)}
        />
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2DeleteButton onClick={() => {}} />
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditSequenceViewModel = () => {
  const componentToEdit: ComponentCTO | null = useSelector(currentComponent);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // check if component to edit is really set or gos back to edit mode
    if (isNullOrUndefined(componentToEdit)) {
      GlobalActions.setModeToEdit();
      handleError("Tried to go to edit component without componentToedit specified");
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [componentToEdit]);

  const changeName = (name: string) => {
    let copyComponentToEdit: ComponentCTO = Carv2Util.deepCopy(componentToEdit);
    copyComponentToEdit.component.name = name;
    dispatch(ComponentActions.setCompoenentToEdit(copyComponentToEdit));
  };

  const saveComponent = () => {
    dispatch(ComponentActions.saveComponent(componentToEdit!));
    if (isCreateAnother) {
      dispatch(GlobalActions.setModeToEditComponent());
    } else {
      dispatch(GlobalActions.setModeToEdit());
    }
  };

  const deleteComponent = () => {
    dispatch(ComponentActions.deleteComponent(componentToEdit!));
    dispatch(GlobalActions.setModeToEdit());
  };

  return {
    label: componentToEdit!.component.id === -1 ? "ADD COMPONENT" : "EDIT COMPONENT",
    name: componentToEdit!.component.name,
    changeName,
    saveComponent,
    deleteComponent,
    cancel: () => dispatch(GlobalActions.setModeToEdit()),
    toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
    textInput,
    showDelete: componentToEdit!.component.id !== -1,
  };
};
