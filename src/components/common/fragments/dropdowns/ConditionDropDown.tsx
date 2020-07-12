import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../dataAccess/access/cto/SequenceCTO";
import { ConditionTO } from "../../../../dataAccess/access/to/ConditionTO";
import { sequenceModelSelectors } from "../../../../slices/SequenceModelSlice";

interface ConditionDropDownButtonProps extends DropdownProps {
  onSelect: (condition: ConditionTO | undefined) => void;
  icon?: string;
}

interface ConditionDropDownProps extends DropdownProps {
  onSelect: (condition: ConditionTO | undefined) => void;
  placeholder?: string;
  value?: number;
}

export const ConditionDropDownButton: FunctionComponent<ConditionDropDownButtonProps> = (props) => {
  const { onSelect, icon } = props;
  const { sequence, selectCondition, conditionOptions } = useConditionDropDownViewModel();

  return (
    <Dropdown
      options={conditionOptions(sequence)}
      icon={icon}
      onChange={(event, data) => onSelect(selectCondition(Number(data.value), sequence))}
      className="button icon"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
    />
  );
};

export const ConditionDropDown: FunctionComponent<ConditionDropDownProps> = (props) => {
  const { onSelect, placeholder, value } = props;
  const { sequence, selectCondition, conditionOptions } = useConditionDropDownViewModel();

  console.info("value: ", value);

  return (
    <Dropdown
      options={conditionOptions(sequence)}
      selection
      selectOnBlur={false}
      placeholder={placeholder || "Select condition ..."}
      onChange={(event, data) => onSelect(selectCondition(Number(data.value), sequence))}
      scrolling
      value={value === -1 ? undefined : value}
    />
  );
};

const useConditionDropDownViewModel = () => {
  const sequenceToEdit: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

  const conditionToOption = (condition: ConditionTO): DropdownItemProps => {
    return {
      key: condition.id,
      value: condition.id,
      text: condition.name,
    };
  };

  const conditionOptions = (sequence: SequenceCTO | null): DropdownItemProps[] => {
    if (!isNullOrUndefined(sequence)) {
      return sequence.conditions.map(conditionToOption);
    }
    return [];
  };

  const selectCondition = (conditionId: number, sequence: SequenceCTO | null): ConditionTO | undefined => {
    if (!isNullOrUndefined(sequence) && !isNullOrUndefined(conditionId)) {
      return sequence.conditions.find((condition) => condition.id === conditionId);
    }
    return undefined;
  };

  return { sequence: sequenceToEdit, conditionOptions, selectCondition };
};
