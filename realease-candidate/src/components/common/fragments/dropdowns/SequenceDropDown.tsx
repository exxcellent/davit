import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { DropdownProps } from "semantic-ui-react";
import { SequenceTO } from "../../../../dataAccess/access/to/SequenceTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitIconDropDown } from "./DavitDropDown";

interface SequenceDropDownProps extends DropdownProps {
    onSelect: (sequence: SequenceTO | undefined) => void;
    placeholder?: string;
    value?: number;
}

interface SequenceDropDownPropsButton extends DropdownProps {
    onSelect: (sequence: SequenceTO | undefined) => void;
    icon?: string;
}

export const SequenceDropDown: FunctionComponent<SequenceDropDownProps> = (props) => {
    const {onSelect, placeholder, value} = props;
    const {sequences, selectSequence, sequenceToOption} = useSequenceDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={sequences.map(sequenceToOption)}
            placeholder={placeholder}
            onSelect={(sequence) => onSelect(selectSequence(Number(sequence.value), sequences))}
            value={value?.toString()}
            clearable={true}
        />
    );
};

export const SequenceDropDownButton: FunctionComponent<SequenceDropDownPropsButton> = (props) => {
    const {onSelect, icon} = props;
    const {sequences, selectSequence, sequenceToOption} = useSequenceDropDownViewModel();

    return (
        <DavitIconDropDown
            dropdownItems={sequences.map(sequenceToOption)}
            icon={icon}
            onSelect={(sequence) => onSelect(selectSequence(Number(sequence.value), sequences))}
        />
    );
};

const useSequenceDropDownViewModel = () => {
    const sequences: SequenceTO[] = useSelector(masterDataSelectors.selectSequences);

    const selectSequence = (sequenceId: number, sequences: SequenceTO[]): SequenceTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(sequenceId) && !DavitUtil.isNullOrUndefined(sequences)) {
            return sequences.find((sequence) => sequence.id === sequenceId);
        }
        return undefined;
    };

    const sequenceToOption = (sequence: SequenceTO): DavitDropDownItemProps => {
        return {
            key: sequence.id,
            value: sequence.id.toString(),
            text: sequence.name,
        };
    };

    return {sequences, selectSequence, sequenceToOption};
};
