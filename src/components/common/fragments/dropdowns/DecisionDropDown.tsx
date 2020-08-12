import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../dataAccess/access/cto/SequenceCTO";
import { DecisionTO } from "../../../../dataAccess/access/to/DecisionTO";
import { sequenceModelSelectors } from "../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../utils/Carv2Util";

interface DecisionDropDownButtonProps extends DropdownProps {
  onSelect: (decision: DecisionTO | undefined) => void;
  icon?: string;
}

interface DecisionDropDownProps extends DropdownProps {
  onSelect: (decision: DecisionTO | undefined) => void;
  placeholder?: string;
  value?: number;
  self?: number;
}

export const DecisionDropDownButton: FunctionComponent<DecisionDropDownButtonProps> = (props) => {
  const { onSelect, icon } = props;
  const { sequenceToEdit, decisionOptions, selectDecision, isEmpty } = useDecisionDropDownViewModel();

  return (
    <Dropdown
      options={decisionOptions()}
      icon={isEmpty ? "" : icon}
      onChange={(event, data) => onSelect(selectDecision(Number(data.value), sequenceToEdit))}
      className="button icon"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={isEmpty}
    />
  );
};

export const DecisionDropDown: FunctionComponent<DecisionDropDownProps> = (props) => {
  const { onSelect, placeholder, value, self } = props;
  const { sequenceToEdit, decisionOptions, selectDecision, isEmpty } = useDecisionDropDownViewModel(self);

  return (
    <Dropdown
      options={decisionOptions()}
      selection
      selectOnBlur={false}
      placeholder={placeholder || "Select decision ..."}
      onChange={(event, data) => onSelect(selectDecision(Number(data.value), sequenceToEdit))}
      scrolling
      value={value === -1 ? undefined : value}
      disabled={isEmpty}
    />
  );
};

const useDecisionDropDownViewModel = (self?: number) => {
  const sequenceToEdit: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  useEffect(() => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      sequenceToEdit?.decisions.length > 0 ? setIsEmpty(false) : setIsEmpty(true);
    }
  }, [sequenceToEdit]);

  const decisionToOption = (decision: DecisionTO): DropdownItemProps => {
    return {
      key: decision.id,
      value: decision.id,
      text: decision.name,
    };
  };

  const decisionOptions = (): DropdownItemProps[] => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      let copyDec: DecisionTO[] = Carv2Util.deepCopy(sequenceToEdit.decisions);
      if (self) {
        copyDec = copyDec.filter((dec) => dec.id !== self);
      }
      return copyDec.map(decisionToOption);
    }
    return [];
  };

  const selectDecision = (decisionId: number, sequence: SequenceCTO | null): DecisionTO | undefined => {
    if (!isNullOrUndefined(sequence) && !isNullOrUndefined(decisionId)) {
      return sequence.decisions.find((decision) => decision.id === decisionId);
    }
    return undefined;
  };

  return { sequenceToEdit, decisionOptions, selectDecision, isEmpty };
};
