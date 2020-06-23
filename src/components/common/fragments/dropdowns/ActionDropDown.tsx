import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ActionCTO } from "../../../../dataAccess/access/cto/ActionCTO";
import { currentActions } from "../../../../slices/SequenceSlice";

interface ActionDropDownProps extends DropdownProps {
  onSelect: (action: ActionCTO | undefined) => void;
  icon?: string;
}

export const ActionDropDown: FunctionComponent<ActionDropDownProps> = (props) => {
  const { onSelect, icon } = props;
  const { actions, actionToOption, selectAction } = useActionDropDownViewModel();

  return (
    <Dropdown
      options={actions.map(actionToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectAction(Number(data.value), actions))}
      scrolling
      floating
      compact
      className="button icon"
      icon={icon}
      trigger={<React.Fragment />}
    />
  );
};

const useActionDropDownViewModel = () => {
  const actions: ActionCTO[] = useSelector(currentActions);

  const actionToOption = (action: ActionCTO): DropdownItemProps => {
    const text: string = `${action.componentTO.name} - ${action.actionTO.actionType} - ${action.dataTO.name}`;
    return {
      key: action.actionTO.id,
      value: action.actionTO.id,
      text: text,
    };
  };

  const selectAction = (actionId: number, actions: ActionCTO[]): ActionCTO | undefined => {
    if (!isNullOrUndefined(actionId) && !isNullOrUndefined(actions)) {
      return actions.find((action) => action.actionTO.id === actionId);
    }
    return undefined;
  };

  return { actions, actionToOption, selectAction };
};
