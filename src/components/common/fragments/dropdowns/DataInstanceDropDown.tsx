import React, { FunctionComponent } from "react";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";

interface DataInstanceDropDownProps extends DropdownProps {
  onSelect: (instanc: number | undefined) => void;
  instances: string[];
  placeholder?: string;
  value?: number;
}

interface DataInstanceDropDownButtonProps extends DropdownProps {
  onSelect: (instancIndex: number | undefined) => void;
  instances: string[];
  icon?: string;
}

export const DataInstanceDropDown: FunctionComponent<DataInstanceDropDownProps> = (props) => {
  const { onSelect, placeholder, value, instances } = props;
  const { selectDataInstance, dataInstacesToOption } = useDataDropDownViewModel();

  return (
    <Dropdown
      options={dataInstacesToOption(instances)}
      placeholder={placeholder || "Select Data Instance ..."}
      onChange={(event, data) => onSelect(selectDataInstance(Number(data.value)))}
      selectOnBlur={false}
      scrolling
      selection
      value={value === -1 ? undefined : value}
    />
  );
};

export const DataInstanceDropDownButton: FunctionComponent<DataInstanceDropDownButtonProps> = (props) => {
  const { onSelect, instances, icon } = props;
  const { selectDataInstance, dataInstacesToOption } = useDataDropDownViewModel();

  return (
    <Dropdown
      options={dataInstacesToOption(instances)}
      icon={icon}
      onChange={(event, data) => onSelect(selectDataInstance(Number(data.value)))}
      className="button icon"
      inverted="true"
      color="orange"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
    />
  );
};

const useDataDropDownViewModel = () => {
  const selectDataInstance = (instanceIndex: number): number | undefined => {
    if (!isNullOrUndefined(instanceIndex)) {
      return instanceIndex;
    }
  };

  const dataInstacesToOption = (instances: string[]): DropdownItemProps[] => {
    const dropdownItemProps: DropdownItemProps[] = [];
    instances.forEach((instanc, i) => dropdownItemProps.push({ key: i, value: i, text: instanc }));
    return dropdownItemProps;
  };

  return { selectDataInstance, dataInstacesToOption };
};
