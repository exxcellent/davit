import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { ActionTO } from "../../../../dataAccess/access/to/ActionTO";
import { getDataAndInstanceIds } from "../../../../dataAccess/access/to/DataTO";
import { editSelectors } from "../../../../slices/EditSlice";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface ConditionDropDownProps extends DropdownProps {
  onSelect: (action: ActionTO | undefined) => void;

  icon?: string;
}

export const ConditionDropDown: FunctionComponent<ConditionDropDownProps> = (props) => {
  const { onSelect, icon } = props;
  const { sequence, selectCondition, conditionOptions, isEmpty } = useConditionDropDownViewModel();

  return (
    <Dropdown
      options={actions.map(actionToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectAction(Number(data.value), actions))}
      scrolling
      disabled={isEmpty}
    />
  );
};

export const ConditionDropDown: FunctionComponent<ConditionDropDownProps> = (props) => {
  const { onSelect, placeholder, value } = props;
  const { sequence, selectCondition, conditionOptions, isEmpty } = useConditionDropDownViewModel();

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
      disabled={isEmpty}
    />
  );
};

const useConditionDropDownViewModel = () => {
  const sequenceToEdit: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  useEffect(() => {
    if (!isNullOrUndefined(sequenceToEdit)) {
      sequenceToEdit.conditions.length > 0 ? setIsEmpty(false) : setIsEmpty(true);
    }
  }, [sequenceToEdit]);

  const actionToOption = (action: ActionTO): DropdownItemProps => {
    const text: string = `${getComponentName(action.componentFk, components)} - ${action.actionType} - ${getDataName(
      action.dataFk,
      datas
    )}`;
    return {
      key: action.id,
      value: action.id,
      text: text,
    };
  };

  const selectAction = (actionId: number, actions: ActionTO[]): ActionTO | undefined => {
    if (!isNullOrUndefined(actionId) && !isNullOrUndefined(actions)) {
      return actions.find((action) => action.id === actionId);
    }
    return undefined;
  };

  return { sequence: sequenceToEdit, conditionOptions, selectCondition, isEmpty };
};
