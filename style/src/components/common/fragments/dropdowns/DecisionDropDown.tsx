import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { DropdownProps } from "semantic-ui-react";
import { SequenceCTO } from "../../../../dataAccess/access/cto/SequenceCTO";
import { DecisionTO } from "../../../../dataAccess/access/to/DecisionTO";
import { sequenceModelSelectors } from "../../../../slices/SequenceModelSlice";
import { DavitUtil } from "../../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitIconDropDown } from "./DavitDropDown";

interface DecisionDropDownButtonProps extends DropdownProps {
    onSelect: (decision: DecisionTO | undefined) => void;
    icon?: string;
}

interface DecisionDropDownProps extends DropdownProps {
    onSelect: (decision: DecisionTO | undefined) => void;
    placeholder?: string;
    value?: number;
    exclude?: number;
}

export const DecisionDropDownButton: FunctionComponent<DecisionDropDownButtonProps> = (props) => {
    const { onSelect, icon } = props;
    const { sequenceToEdit, decisionOptions, selectDecision } = useDecisionDropDownViewModel();

    return (
        <DavitIconDropDown
            dropdownItems={decisionOptions()}
            onSelect={(decision) => onSelect(selectDecision(Number(decision.value), sequenceToEdit))}
            icon={icon}
        />
    );
};

export const DecisionDropDown: FunctionComponent<DecisionDropDownProps> = (props) => {
    const { onSelect, placeholder, value, exclude } = props;
    const { sequenceToEdit, decisionOptions, selectDecision } = useDecisionDropDownViewModel(exclude);

    return (
        <DavitDropDown
            dropdownItems={decisionOptions()}
            placeholder={placeholder}
            onSelect={(decision) => onSelect(selectDecision(Number(decision.value), sequenceToEdit))}
            value={value?.toString()}
        />
    );
};

const useDecisionDropDownViewModel = (exclude?: number) => {
    const sequenceToEdit: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

    const decisionToOption = (decision: DecisionTO): DavitDropDownItemProps => {
        return {
            key: decision.id,
            value: decision.id.toString(),
            text: decision.name,
        };
    };

    const decisionOptions = (): DavitDropDownItemProps[] => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            let copyDec: DecisionTO[] = DavitUtil.deepCopy(sequenceToEdit!.decisions);
            if (exclude) {
                copyDec = copyDec.filter((dec) => dec.id !== exclude);
            }
            return copyDec.map(decisionToOption);
        }
        return [];
    };

    const selectDecision = (decisionId: number, sequence: SequenceCTO | null): DecisionTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(sequence) && !DavitUtil.isNullOrUndefined(decisionId)) {
            return sequence!.decisions.find((decision) => decision.id === decisionId);
        }
        return undefined;
    };

    return { sequenceToEdit, decisionOptions, selectDecision };
};
