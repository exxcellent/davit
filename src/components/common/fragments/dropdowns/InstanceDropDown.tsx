import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';

import { DataCTO } from '../../../../dataAccess/access/cto/DataCTO';
import { DataInstanceTO } from '../../../../dataAccess/access/to/DataInstanceTO';
import { masterDataSelectors } from '../../../../slices/MasterDataSlice';

export interface DataAndInstanceId {
  dataFk: number;
  instanceId: number;
}

interface InstanceDropDownProps extends DropdownProps {
  onSelect: (dataAndInstance: DataAndInstanceId | undefined) => void;
  placeholder?: string;
  value?: string;
}

interface InstanceDropDownButtonProps extends DropdownProps {
  onSelect: (dataAndInstance: DataAndInstanceId | undefined) => void;
  icon?: string;
}

export const InstanceDropDown: FunctionComponent<InstanceDropDownProps> = (
  props
) => {
  const { onSelect, placeholder, value } = props;
  const { selectInstance, createOptions } = useInstanceDropDownViewModel();

  return (
    <Dropdown
      options={createOptions()}
      placeholder={placeholder || "Select Data ..."}
      onChange={(event, instance) =>
        onSelect(selectInstance(instance.value!.toString()))
      }
      selectOnBlur={false}
      scrolling
      selection
      value={value !== "" ? value : undefined}
      disabled={createOptions().length > 0 ? false : true}
    />
  );
};

export const InstanceDropDownButton: FunctionComponent<InstanceDropDownButtonProps> = (
  props
) => {
  const { onSelect, icon } = props;
  const { selectInstance, createOptions } = useInstanceDropDownViewModel();

  return (
    <Dropdown
      options={createOptions()}
      icon={createOptions().length > 0 ? icon : ""}
      onChange={(event, instance) =>
        onSelect(selectInstance(instance.value!.toString()))
      }
      className="button icon"
      inverted="true"
      color="orange"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={createOptions().length > 0 ? false : true}
    />
  );
};

const useInstanceDropDownViewModel = () => {
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

  const selectInstance = (
    optionItemString: string
  ): DataAndInstanceId | undefined => {
    if (optionItemString !== null && datas !== null) {
      const optionItem: DataAndInstanceId = JSON.parse(optionItemString);
      return optionItem;
    }
    return undefined;
  };

  const createOptions = (): DropdownItemProps[] => {
    let dropdownItemas: DropdownItemProps[] = [];
    if (datas) {
      datas.forEach((data) =>
        data.data.instances.forEach((inst) =>
          dropdownItemas.push(instanceToOption(inst, data))
        )
      );
    }
    return dropdownItemas;
  };

  const instanceToOption = (
    instance: DataInstanceTO,
    data: DataCTO
  ): DropdownItemProps => {
    const optionItem: DataAndInstanceId = {
      dataFk: data.data.id,
      instanceId: instance.id,
    };
    const optionItemString: string = JSON.stringify(optionItem);
    let optionLabel: string = data.data.name;
    if (instance.id > 1) {
      optionLabel = optionLabel + " - " + instance.name;
    }
    return {
      key: optionItemString,
      value: optionItemString,
      text: optionLabel,
    };
  };

  return { selectInstance, createOptions };
};
