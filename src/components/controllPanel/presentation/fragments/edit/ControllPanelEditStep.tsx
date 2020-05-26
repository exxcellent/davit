import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { Carv2Util } from "../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../common/fragments/buttons/Carv2DeleteButton";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { ControllPanelEditSub } from "./common/ControllPanelEditSub";
import {
  useGetComponentDropdown,
  useGetComponentDropdownLable,
} from "./common/fragments/Carv2DropDown";
import { Carv2LabelTextfield } from "./common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "./common/fragments/Carv2SubmitCancel";
import { OptionField } from "./common/OptionField";
import "./ControllPanelEdit.css";

export interface ControllPanelEditStepProps {
  sequenceStep: SequenceStepCTO;
}

export const ControllPanelEditStep: FunctionComponent<ControllPanelEditStepProps> = (
  props
) => {
  const { sequenceStep } = props;

  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const [label, setLabel] = useState<string>("Create Step");
  const textInput = useRef<Input>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sequenceStep.squenceStepTO.id !== -1) {
      setLabel("Edit Step");
    }
  }, [sequenceStep]);

  const setSequenceStepToEdit = (
    sequenceStepToEdit: SequenceStepCTO | null
  ) => {
    dispatch(ControllPanelActions.setSequenceStepToEdit(sequenceStepToEdit));
  };

  const cancelEditStep = () => {
    dispatch(ControllPanelActions.cancelEditStep());
  };

  const saveSequenceStepChanges = () => {
    dispatch(
      ControllPanelActions.saveSequenceStep(Carv2Util.deepCopy(sequenceStep))
    );
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setSequenceStepToEdit(null));
      dispatch(ControllPanelActions.setMode(Mode.EDIT_SEQUENCE));
    } else {
      dispatch(
        ControllPanelActions.setSequenceStepToEdit(new SequenceStepCTO())
      );
      textInput.current!.focus();
    }
  };

  const selectComponentDatas = (component: ComponentCTO | undefined) => {
    dispatch(ControllPanelActions.setComponentToEdit(component || null));
    dispatch(
      ControllPanelActions.setMode(Mode.EDIT_SEQUENCE_STEP_COMPONENT_DATA)
    );
  };

  const addSourceToStep = (sourceComponent: ComponentCTO | undefined) => {
    const copyStep: SequenceStepCTO = Carv2Util.deepCopy(sequenceStep);
    if (sourceComponent !== undefined) {
      copyStep.componentCTOSource = sourceComponent;
    }
    setSequenceStepToEdit(copyStep);
  };

  const addTargetToStep = (targetComponent: ComponentCTO | undefined) => {
    const copyStep: SequenceStepCTO = Carv2Util.deepCopy(sequenceStep);
    if (targetComponent !== undefined) {
      copyStep.componentCTOSource = targetComponent;
    }
    setSequenceStepToEdit(copyStep);
  };

  return (
    <ControllPanelEditSub label={label}>
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Step Name"
        onChange={(event: any) => {
          setSequenceStepToEdit({
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
