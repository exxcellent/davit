import React, { FunctionComponent } from "react";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { DataInstanceTO } from "../../../../dataAccess/access/to/DataInstanceTO";

interface DataInstanceDropDownProps extends DropdownProps {
  onSelect: (instance: DataInstanceTO | undefined) => void;
  instances: DataInstanceTO[];
  placeholder?: string;
  value?: number;
}

interface DataInstanceDropDownButtonProps extends DropdownProps {
  onSelect: (instance: DataInstanceTO | undefined) => void;
  instances: DataInstanceTO[];
  icon?: string;
}

export const DataInstanceDropDown: FunctionComponent<DataInstanceDropDownProps> = (props) => {
  const { onSelect, placeholder, value, instances } = props;
  const { selectDataInstance, dataInstacesToOption } = useDataInstanceDropDownViewModel();

  return (
    <Dropdown
      options={dataInstacesToOption(instances)}
      placeholder={placeholder || "Select Data Instance ..."}
      onChange={(event, data) => onSelect(selectDataInstance(Number(data.value), instances))}
      selectOnBlur={false}
      scrolling
      selection
      value={value === -1 ? undefined : value}
      disabled={instances.length > 0 ? false : true}
    />
  );
};

export const DataInstanceDropDownButton: FunctionComponent<DataInstanceDropDownButtonProps> = (props) => {
  const { onSelect, instances, icon } = props;
  const { selectDataInstance, dataInstacesToOption } = useDataInstanceDropDownViewModel();

  return (
    <Dropdown
      options={dataInstacesToOption(instances)}
      icon={instances.length > 0 ? icon : ""}
      onChange={(event, data) => onSelect(selectDataInstance(Number(data.value), instances))}
      className="button icon"
      inverted="true"
      color="orange"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={instances.length > 0 ? false : true}
    />
  );
};

const useDataInstanceDropDownViewModel = () => {

  const selectDataInstance = (instanceIndex: number, instances: DataInstanceTO[]): DataInstanceTO | undefined => {
    let instance: DataInstanceTO | undefined;
    if (instanceIndex !== null && instanceIndex !== undefined) {
      instance = instances.find(inst => inst.id === instanceIndex);
    }
    return instance;
  };

  const dataInstacesToOption = (instances: DataInstanceTO[]): DropdownItemProps[] => {
    const dropdownItemProps: DropdownItemProps[] = [];
    instances.forEach((instanc) => dropdownItemProps.push({ key: instanc.id, value: instanc.id, text: instanc.name }));
    return dropdownItemProps;
  };

  return { selectDataInstance, dataInstacesToOption };
};
