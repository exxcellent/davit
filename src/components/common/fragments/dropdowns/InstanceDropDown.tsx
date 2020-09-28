import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { DataInstanceTO } from "../../../../dataAccess/access/to/DataInstanceTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface InstanceDropDownProps extends DropdownProps {
  onSelect: (instance: DataInstanceTO | undefined) => void;
  placeholder?: string;
  value?: number;
  filterDataId?: number;
}

interface InstanceDropDownButtonProps extends DropdownProps {
  onSelect: (instance: DataInstanceTO | undefined) => void;
  icon?: string;
  filterDataId?: number;
}

export const InstanceDropDown: FunctionComponent<InstanceDropDownProps> = (props) => {
  const { onSelect, placeholder, value, filterDataId } = props;
  const { instances, selectInstance, instanceToOption } = useDataDropDownViewModel();

  return (
    <Dropdown
      options={
        filterDataId
          ? instances.filter((inst) => inst.dataFk === filterDataId).map(instanceToOption)
          : instances.map(instanceToOption)
      }
      placeholder={placeholder || "Select Data ..."}
      onChange={(event, instance) => onSelect(selectInstance(Number(instance.value), instances))}
      selectOnBlur={false}
      scrolling
      selection
      value={value === -1 ? undefined : value}
      disabled={instances.length > 0 ? false : true}
    />
  );
};

export const InstanceDropDownButton: FunctionComponent<InstanceDropDownButtonProps> = (props) => {
  const { onSelect, icon, filterDataId } = props;
  const { instances, selectInstance, instanceToOption } = useDataDropDownViewModel();

  return (
    <Dropdown
      options={
        filterDataId
          ? instances.filter((inst) => inst.dataFk === filterDataId).map(instanceToOption)
          : instances.map(instanceToOption)
      }
      icon={instances.length > 0 ? icon : ""}
      onChange={(event, instance) => onSelect(selectInstance(Number(instance.value), instances))}
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
  const instances: DataInstanceTO[] = useSelector(masterDataSelectors.instances);

  const selectInstance = (id: number, instances: DataInstanceTO[]): DataInstanceTO | undefined => {
    if (id !== null && instances !== null) {
      return instances.find((inst) => inst.id === id);
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

  return { instances, selectInstance, instanceToOption };
};
