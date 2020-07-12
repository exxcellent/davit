import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { SequenceCTO } from "../../../../dataAccess/access/cto/SequenceCTO";
import { sequenceModelSelectors } from "../../../../slices/SequenceModelSlice";

interface StepIndexDropDownProps extends DropdownProps {
  onSelect: (index: number | undefined) => void;
  placeholder?: string;
  value?: number;
}

export const StepIndexDropDown: FunctionComponent<StepIndexDropDownProps> = (props) => {
  const { onSelect, placeholder, value } = props;
  const { getSteps, indexToOptions } = useStepIndexDropDownViewModel();

  return (
    <Dropdown
      options={getSteps().map(indexToOptions)}
      selection
      selectOnBlur={false}
      placeholder={placeholder || "Select Component ..."}
      onChange={(event, data) => onSelect(Number(data.value))}
      scrolling
      value={value}
      compact
    />
  );
};

const useStepIndexDropDownViewModel = () => {
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

  const getSteps = (): number[] => {
    let indexes: number[] = [];
    if (selectedSequence) {
      let length: number = selectedSequence.sequenceStepCTOs.length + 1;
      indexes = Array.from(Array(length).keys());
      indexes = indexes.map((index) => (index = index + 1));
    }
    return indexes;
  };

  const indexToOptions = (index: number): DropdownItemProps => {
    return {
      key: index,
      value: index,
      text: index,
    };
  };

  return { getSteps, indexToOptions };
};
