import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { sequenceModelSelectors } from "../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../utils/Carv2Util";

interface StepDropDownButtonProps extends DropdownProps {
  onSelect: (step: SequenceStepCTO | undefined) => void;
  icon?: string;
}

interface StepDropDownProps extends DropdownProps {
  onSelect: (step: SequenceStepCTO | undefined) => void;
  placeholder?: string;
  value?: number;
  self?: number;
}

export const StepDropDownButton: FunctionComponent<StepDropDownButtonProps> = (props) => {
  const { onSelect, icon } = props;
  const { sequence, stepOptions, selectSequenceStep, isEmpty } = useStepDropDownViewModel();

  return (
    <Dropdown
      options={stepOptions()}
      icon={isEmpty ? "" : icon}
      onChange={(event, data) => onSelect(selectSequenceStep(Number(data.value), sequence))}
      className="button icon"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={isEmpty}
    />
  );
};

export const StepDropDown: FunctionComponent<StepDropDownProps> = (props) => {
  const { onSelect, placeholder, value, self } = props;
  const { sequence, stepOptions, selectSequenceStep, isEmpty } = useStepDropDownViewModel(self);

  return (
    <Dropdown
      options={stepOptions()}
      selection
      selectOnBlur={false}
      placeholder={placeholder || "Select step ..."}
      onChange={(event, data) => onSelect(selectSequenceStep(Number(data.value), sequence))}
      scrolling
      value={value === -1 ? undefined : value}
      disabled={isEmpty}
    />
  );
};

const useStepDropDownViewModel = (self?: number) => {
  const sequenceToEdit: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  useEffect(() => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      sequenceToEdit.sequenceStepCTOs.length > 0 ? setIsEmpty(false) : setIsEmpty(true);
    }
  }, [sequenceToEdit]);

  const stepToOption = (step: SequenceStepCTO): DropdownItemProps => {
    return {
      key: step.squenceStepTO.id,
      value: step.squenceStepTO.id,
      text: step.squenceStepTO.name,
    };
  };

  const stepOptions = (): DropdownItemProps[] => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      let copySteps: SequenceStepCTO[] = Carv2Util.deepCopy(sequenceToEdit.sequenceStepCTOs);
      if (self) {
        copySteps = copySteps.filter((step) => step.squenceStepTO.id !== self);
      }
      return copySteps.map(stepToOption);
    }
    return [];
  };

  const selectSequenceStep = (stepId: number, sequence: SequenceCTO | null): SequenceStepCTO | undefined => {
    if (!isNullOrUndefined(sequence) && !isNullOrUndefined(stepId)) {
      return sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === stepId);
    }
    return undefined;
  };

  return { sequence: sequenceToEdit, stepOptions, selectSequenceStep, isEmpty };
};
