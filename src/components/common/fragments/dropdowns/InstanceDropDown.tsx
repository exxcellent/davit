import React, { FunctionComponent } from 'react';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';

import { DataInstanceTO } from '../../../../dataAccess/access/to/DataInstanceTO';

interface InstanceDropDownProps extends DropdownProps {
  onSelect: (instance: DataInstanceTO | undefined) => void;
  instances: DataInstanceTO[];
  placeholder?: string;
  value?: number;
}

interface InstanceDropDownButtonProps extends DropdownProps {
  onSelect: (instance: DataInstanceTO | undefined) => void;
  instances: DataInstanceTO[];
  icon?: string;
}

export const InstanceDropDown: FunctionComponent<InstanceDropDownProps> = (
  props
) => {
  const { onSelect, placeholder, value, instances } = props;
  const { selectInstance, instanceToOption } = useDataDropDownViewModel();

  return (
    <Dropdown
      options={instances.map(instanceToOption)}
      placeholder={placeholder || "Select Data ..."}
      onChange={(event, instance) =>
        onSelect(selectInstance(instance.key, instances))
      }
      selectOnBlur={false}
      scrolling
      selection
      value={value === -1 ? undefined : value}
      disabled={instances.length > 0 ? false : true}
    />
  );
};

export const InstanceDropDownButton: FunctionComponent<InstanceDropDownButtonProps> = (
  props
) => {
  const { onSelect, icon, instances } = props;
  const { selectInstance, instanceToOption } = useDataDropDownViewModel();

  return (
    <Dropdown
      options={instances.map(instanceToOption)}
      icon={instances.length > 0 ? icon : ""}
      onChange={(event, instance) =>
        onSelect(selectInstance(instance.key, instances))
      }
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

const useDataDropDownViewModel = () => {
  const selectInstance = (
    idName: string,
    instances: DataInstanceTO[]
  ): DataInstanceTO | undefined => {
    if (idName !== null && instances !== null) {
      return instances.find((inst) => inst.id === idName);
    }
    return undefined;
  };

  const instanceToOption = (instance: DataInstanceTO): DropdownItemProps => {
    return {
      key: instance.id,
      value: instance.id,
      text: instance.name,
    };
  };

  return { selectInstance, instanceToOption };
};
