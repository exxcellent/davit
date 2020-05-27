import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { Carv2Util } from "../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../common/fragments/buttons/Carv2DeleteButton";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { ControllPanelEditSub } from "./common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "./common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "./common/fragments/Carv2SubmitCancel";
import "./ControllPanelEdit.css";

export interface ControllPanelEditSequenceProps {
  sequence: SequenceCTO;
}

export const ControllPanelEditSequence: FunctionComponent<ControllPanelEditSequenceProps> = (
  props
) => {
  const { sequence } = props;

  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const [label, setLabel] = useState<string>("Create Sequence");
  const textInput = useRef<Input>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ControllPanelActions.setSequenceToEdit);
    if (sequence.sequenceTO.id !== -1) {
      setLabel("Edit Sequence");
    }
  }, [sequence, dispatch]);

  const setSequenceToEdit = (sequenceToEdit: SequenceCTO | null) => {
    dispatch(ControllPanelActions.setSequenceToEdit(sequenceToEdit));
  };

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
          setSequenceToEdit({
            ...sequence,
            sequenceTO: { ...sequence.sequenceTO, name: event.target.value },
          });
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
