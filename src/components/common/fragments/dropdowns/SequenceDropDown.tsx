import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceTO } from "../../../../dataAccess/access/to/SequenceTO";
import { selectSequences } from "../../../../slices/SequenceSlice";

interface SequenceDropDownProps extends DropdownProps {
  onSelect: (sequence: SequenceTO | undefined) => void;
  placeholder?: string;
  icon?: string;
}

export const SequenceDropDown: FunctionComponent<SequenceDropDownProps> = (props) => {
  const { onSelect, placeholder, icon } = props;
  const { sequences, selectSequence, sequenceToOption } = useSequenceDropDownViewModel();

  return (
    <>
      {placeholder && (
        <Dropdown
          options={sequences.map(sequenceToOption)}
          selection
          clearable
          selectOnBlur={false}
          placeholder={placeholder}
          onChange={(event, data) => onSelect(selectSequence(Number(data.value), sequences))}
          scrolling
        />
      )}
      {icon && (
        <Dropdown
          options={sequences.map(sequenceToOption)}
          icon={icon}
          onChange={(event, sequence) => onSelect(selectSequence(Number(sequence.value), sequences))}
          className="button icon"
          inverted="true"
          color="orange"
          floating
          selectOnBlur={false}
          trigger={<React.Fragment />}
          scrolling
        />
      )}
    </>
  );
};

const useSequenceDropDownViewModel = () => {
  const sequences: SequenceTO[] = useSelector(selectSequences);

  const selectSequence = (sequenceId: number, sequences: SequenceTO[]): SequenceTO | undefined => {
    if (!isNullOrUndefined(sequenceId) && !isNullOrUndefined(sequences)) {
      return sequences.find((sequence) => sequence.id === sequenceId);
    }
    return undefined;
  };

  const sequenceToOption = (sequence: SequenceTO): DropdownItemProps => {
    return {
      key: sequence.id,
      value: sequence.id,
      text: sequence.name,
    };
  };

  return { sequences, selectSequence, sequenceToOption };
};
