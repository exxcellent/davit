import React, { FunctionComponent } from "react";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { ActionType } from "../../../../dataAccess/access/types/ActionType";

interface ActionTypeDropDownnProps extends DropdownProps {
  onSelect: (actionType: ActionType | undefined) => void;
  placeholder?: string;
  value?: ActionType;
}

export const ActionTypeDropDown: FunctionComponent<ActionTypeDropDownnProps> = (props) => {
  const { onSelect, placeholder, value } = props;
  const actions: ActionType[] = Object.values(ActionType);

  const actionTypeToOption = (actionType: ActionType): DropdownItemProps => {
    return {
      key: actionType,
      value: actionType,
      text: actionType,
    };
  };

  return (
    <Dropdown
      options={actions.map(actionTypeToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      onChange={(event, data) => onSelect(data.value as ActionType)}
      scrolling
      placeholder={placeholder || "Select Action Type ..."}
      value={value}
    />
  );
};
