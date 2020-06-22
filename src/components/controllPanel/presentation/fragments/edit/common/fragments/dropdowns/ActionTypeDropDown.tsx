import React, { FunctionComponent } from "react";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { ActionType } from "../../../../../../../../dataAccess/access/types/ActionType";

interface ActionTypeDropDownnProps extends DropdownProps {
  onSelect: (actionType: ActionType | undefined) => void;
  placeholder: string;
}

export const ActionTypeDropDown: FunctionComponent<ActionTypeDropDownnProps> = (props) => {
  const { onSelect, placeholder } = props;
  const actions: ActionType[] = Object.values(ActionType);

  const actionTypeToOption = (actionType: ActionType): DropdownItemProps => {
    return {
      key: actionType,
      value: actionType,
      text: actionType,
    };
  };

  const selectActionType = (actionType: ActionType): ActionType | undefined => {
    switch (actionType) {
      case ActionType.ADD:
        return ActionType.ADD;
      case ActionType.CHECK:
        return ActionType.CHECK;
      case ActionType.DELETE:
        return ActionType.DELETE;
    }
  };

  return (
    <Dropdown
      options={actions.map(actionTypeToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectActionType(data.value as ActionType))}
      scrolling
      placeholder={placeholder}
    />
  );
};
