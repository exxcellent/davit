import React, { FunctionComponent } from "react";
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
  exclude?: number;
}

export const StepDropDownButton: FunctionComponent<StepDropDownButtonProps> = (props) => {
  const { onSelect, icon } = props;
  const { sequence, stepOptions, selectSequenceStep } = useStepDropDownViewModel();

  return (
    <Dropdown
      options={stepOptions()}
      icon={sequence ? (sequence?.sequenceStepCTOs.length > 0 ? icon : "") : ""}
      onChange={(event, data) => onSelect(selectSequenceStep(Number(data.value), sequence))}
      className="button icon"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={sequence ? (sequence?.sequenceStepCTOs.length > 0 ? false : true) : false}
    />
  );
};

export const StepDropDown: FunctionComponent<StepDropDownProps> = (props) => {
  const { onSelect, placeholder, value, exclude } = props;
  const { sequence, stepOptions, selectSequenceStep } = useStepDropDownViewModel(exclude);

  return (
    <Dropdown
      options={stepOptions()}
      selection
      selectOnBlur={false}
      placeholder={placeholder || "Select step ..."}
      onChange={(event, data) => onSelect(selectSequenceStep(Number(data.value), sequence))}
      scrolling
      value={value === -1 ? undefined : value}
      disabled={sequence ? (sequence?.sequenceStepCTOs.length > 0 ? false : true) : false}
    />
  );
};

const useStepDropDownViewModel = (exclude?: number) => {
  const sequenceToEdit: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

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
      if (exclude) {
        copySteps = copySteps.filter((step) => step.squenceStepTO.id !== exclude);
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

  return { sequence: sequenceToEdit, stepOptions, selectSequenceStep };
};
