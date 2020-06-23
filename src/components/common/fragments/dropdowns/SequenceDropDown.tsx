import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../dataAccess/access/cto/SequenceCTO";
import { selectSequences } from "../../../../slices/SequenceSlice";

interface SequenceDropDownProps extends DropdownProps {
  onSelect: (sequence: SequenceCTO | undefined) => void;
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
  const sequences: SequenceCTO[] = useSelector(selectSequences);

  const selectSequence = (sequenceId: number, sequences: SequenceCTO[]): SequenceCTO | undefined => {
    if (!isNullOrUndefined(sequenceId) && !isNullOrUndefined(sequences)) {
      return sequences.find((sequence) => sequence.sequenceTO.id === sequenceId);
    }
    return undefined;
  };

  const sequenceToOption = (sequence: SequenceCTO): DropdownItemProps => {
    return {
      key: sequence.sequenceTO.id,
      value: sequence.sequenceTO.id,
      text: sequence.sequenceTO.name,
    };
  };

  return { sequences, selectSequence, sequenceToOption };
};
