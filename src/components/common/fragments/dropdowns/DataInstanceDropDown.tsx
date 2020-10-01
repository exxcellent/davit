import React, { FunctionComponent } from 'react';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';

import { DataInstanceTO } from '../../../../dataAccess/access/to/DataInstanceTO';

interface DataInstanceDropDownProps extends DropdownProps {
  onSelect: (id: number | undefined) => void;
  instances: DataInstanceTO[];
  placeholder?: string;
  value?: number;
}

interface DataInstanceDropDownButtonProps extends DropdownProps {
  onSelect: (id: number | undefined) => void;
  instances: DataInstanceTO[];
  icon?: string;
}

export const DataInstanceDropDown: FunctionComponent<DataInstanceDropDownProps> = (
  props
) => {
  const { onSelect, placeholder, value, instances } = props;
  const { dataInstacesToOption } = useDataInstanceDropDownViewModel();

  return (
    <Dropdown
      options={dataInstacesToOption(instances)}
      placeholder={placeholder || "Select Data Instance ..."}
      onChange={(event, data) => onSelect(Number(data.value))}
      selectOnBlur={false}
      scrolling
      selection
      value={value === -1 ? undefined : value}
      disabled={dataInstacesToOption(instances).length > 0 ? false : true}
    />
  );
};

export const DataInstanceDropDownButton: FunctionComponent<DataInstanceDropDownButtonProps> = (
  props
) => {
  const { onSelect, instances, icon } = props;
  const { dataInstacesToOption } = useDataInstanceDropDownViewModel();

  return (
    <Dropdown
      options={dataInstacesToOption(instances)}
      icon={dataInstacesToOption(instances).length > 0 ? icon : ""}
      onChange={(event, data) => onSelect(Number(data.value))}
      className="button icon"
      inverted="true"
      color="orange"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={dataInstacesToOption(instances).length > 0 ? false : true}
    />
  );
};

const useDataInstanceDropDownViewModel = () => {
  const dataInstacesToOption = (
    instances: DataInstanceTO[]
  ): DropdownItemProps[] => {
    const dropdownItemProps: DropdownItemProps[] = [];
    instances
      .filter((inst) => inst.defaultInstance === false)
      .forEach((instanc) =>
        dropdownItemProps.push({
          key: instanc.id,
          value: instanc.id,
          text: instanc.name,
        })
      );
    console.info("instances: ", dropdownItemProps);
    return dropdownItemProps;
  };

  return { dataInstacesToOption };
};
