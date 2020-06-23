import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { GroupTO } from "../../../../dataAccess/access/to/GroupTO";
import { selectGroups } from "../../../../slices/ComponentSlice";

interface GroupDropDownProps extends DropdownProps {
  onSelect: (group: GroupTO | undefined) => void;
  placeholder?: string;
  icon?: string;
}

export const GroupDropDown: FunctionComponent<GroupDropDownProps> = (props) => {
  const { onSelect, placeholder, icon } = props;
  const { groups, groupToOption, selectGroup } = useGroupDropDownViewModel();

  return (
    <>
      {placeholder && (
        <Dropdown
          options={groups.map(groupToOption).sort((a, b) => {
            return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
          })}
          selection
          selectOnBlur={false}
          placeholder={placeholder}
          onChange={(event, data) => onSelect(selectGroup(Number(data.value), groups))}
          scrolling
          clearable
          value={placeholder}
        />
      )}
      {icon && (
        <Dropdown
          options={groups.map(groupToOption).sort((a, b) => {
            return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
          })}
          icon={icon}
          selectOnBlur={false}
          onChange={(event, data) => onSelect(selectGroup(Number(data.value), groups))}
          className="button icon"
          floating
          trigger={<React.Fragment />}
          scrolling
        />
      )}
    </>
  );
};

const useGroupDropDownViewModel = () => {
  const groups: GroupTO[] = useSelector(selectGroups);

  const groupToOption = (group: GroupTO): DropdownItemProps => {
    return {
      key: group.id,
      value: group.id,
      text: group.name,
    };
  };

  const selectGroup = (groupId: number, groups: GroupTO[]): GroupTO | undefined => {
    if (!isNullOrUndefined(groups) && !isNullOrUndefined(groupId)) {
      return groups.find((group) => group.id === groupId);
    }
    return undefined;
  };

  return { groups, groupToOption, selectGroup };
};
