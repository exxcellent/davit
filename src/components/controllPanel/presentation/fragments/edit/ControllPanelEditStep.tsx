import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { currentSequence } from "../../../../../slices/SequenceSlice";
import { Carv2Util } from "../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../common/fragments/buttons/Carv2DeleteButton";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { ControllPanelEditSub } from "./common/ControllPanelEditSub";
import { useGetComponentDropdown, useGetComponentDropdownLable } from "./common/fragments/Carv2DropDown";
import { Carv2LabelTextfield } from "./common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "./common/fragments/Carv2SubmitCancel";
import { OptionField } from "./common/OptionField";
import "./ControllPanelEdit.css";

export interface ControllPanelEditStepProps {
  sequenceStep: SequenceStepCTO;
}

export const ControllPanelEditStep: FunctionComponent<ControllPanelEditStepProps> = (props) => {
  const { sequenceStep } = props;

  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const [label, setLabel] = useState<string>("Create Step");
  const textInput = useRef<Input>(null);
  const dispatch = useDispatch();
  const sequence: SequenceCTO | null = useSelector(currentSequence);

  useEffect(() => {
    dispatch(ControllPanelActions.setSequenceStepToEdit(sequenceStep));
    if (sequenceStep.squenceStepTO.id !== -1) {
      setLabel("Edit Step");
      sequence?.sequenceStepCTOs.push(sequenceStep);
    }
    dispatch(ControllPanelActions.setSequenceStepToEdit(sequenceStep));
  }, [sequenceStep, dispatch, sequence]);

  const updateSequence = (sequenceStep: SequenceStepCTO) => {
    dispatch(ControllPanelActions.setSequenceStepToEdit(sequenceStep));
    // setSequenceStepToEdit(sequenceStep);
    let copySequence: SequenceCTO = Carv2Util.deepCopy(sequence);
    copySequence.sequenceStepCTOs.splice(sequenceStep.squenceStepTO.index, 1, sequenceStep);
    dispatch(ControllPanelActions.setSequenceToEdit(copySequence));
  };

  const cancelEditStep = () => {
    dispatch(ControllPanelActions.cancelEditStep());
  };

  const saveSequenceStepChanges = () => {
    // dispatch(
    //   ControllPanelActions.saveSequenceStep(Carv2Util.deepCopy(sequenceStep))
    // );
    // if (!isCreateAnother) {
    //   dispatch(ControllPanelActions.setSequenceStepToEdit(null));
    //   dispatch(ControllPanelActions.setMode(Mode.EDIT_SEQUENCE));
    // } else {
    //   dispatch(
    //     ControllPanelActions.setSequenceStepToEdit(new SequenceStepCTO())
    //   );
    //   textInput.current!.focus();
    // }
  };

  const selectComponentDatas = (component: ComponentCTO | undefined) => {
    dispatch(ControllPanelActions.setComponentToEdit(component || null));
    dispatch(ControllPanelActions.setMode(Mode.EDIT_SEQUENCE_STEP_COMPONENT_DATA));
  };

  const addSourceToStep = (sourceComponent: ComponentCTO | undefined) => {
    const copyStep: SequenceStepCTO = Carv2Util.deepCopy(sequenceStep);
    if (sourceComponent !== undefined) {
      copyStep.componentCTOSource = sourceComponent;
    }
    updateSequence(copyStep);
  };

  const addTargetToStep = (targetComponent: ComponentCTO | undefined) => {
    const copyStep: SequenceStepCTO = Carv2Util.deepCopy(sequenceStep);
    if (targetComponent !== undefined) {
      copyStep.componentCTOTarget = targetComponent;
    }
    updateSequence(copyStep);
  };

  return (
    <ControllPanelEditSub label={label}>
      <div className="controllPanelEditChild">
        <Carv2LabelTextfield
          label="Name:"
          placeholder="Step Name"
          onChange={(event: any) => {
            updateSequence({
              ...sequenceStep,
              squenceStepTO: {
                ...sequenceStep.squenceStepTO,
                name: event.target.value,
              },
            });
          }}
          value={sequenceStep.squenceStepTO.name}
          autoFocus
          ref={textInput}
        />
        <Carv2LabelTextfield
          label="Index:"
          placeholder="Step Index"
          onChange={(event: any) => {
            updateSequence({
              ...sequenceStep,
              squenceStepTO: {
                ...sequenceStep.squenceStepTO,
                index: event.target.value,
              },
            });
          }}
          value={sequenceStep.squenceStepTO.index}
        />
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField>
          {useGetComponentDropdownLable(addSourceToStep, "Select Source")}
          {useGetComponentDropdownLable(addTargetToStep, "Select Target")}
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Button.Group>
          <Button id="buttonGroupLabel" disabled inverted color="orange">
            Component Data
          </Button>
          {useGetComponentDropdown(selectComponentDatas, "wrench")}
        </Button.Group>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2SubmitCancel
          onSubmit={saveSequenceStepChanges}
          onCancel={cancelEditStep}
          onChange={() => setIsCreateAnother(!isCreateAnother)}
        />
        <Carv2DeleteButton onClick={() => {}} />
      </div>
    </ControllPanelEditSub>
  );
};
