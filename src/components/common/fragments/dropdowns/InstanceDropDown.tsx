import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';

import { DataCTO } from '../../../../dataAccess/access/cto/DataCTO';
import { DataInstanceTO } from '../../../../dataAccess/access/to/DataInstanceTO';
import { masterDataSelectors } from '../../../../slices/MasterDataSlice';

export interface DataAndInstanceId {
  data: DataCTO;
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
      value={value?.length === 0 ? undefined : value}
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

  const selectInstance = (itemId: string): DataAndInstanceId | undefined => {
    console.info("Itemid: ", itemId);
    if (itemId !== null && datas !== null) {
      const data: DataCTO | undefined = datas.find(
        (data) => data.data.id === getDataId(itemId)
      );
      if (data) {
        return { data: data, instanceId: getInstanceId(itemId) };
      }
    }
    return undefined;
  };

  const getDataId = (instanceId: string): number => {
    const ids: string[] = instanceId.split(":");
    return Number(ids[0]);
  };

  const getInstanceId = (instanceId: string): number => {
    const ids: string[] = instanceId.split(":");
    return Number(ids[1]);
  };

  const createOptions = (): DropdownItemProps[] => {
    let dropdownItemas: DropdownItemProps[] = [];
    if (datas) {
      datas.forEach((data) =>
        data.data.instances.forEach((inst) =>
          dropdownItemas.push(instanceToOption(inst, data.data.id))
        )
      );
    }
    return dropdownItemas;
  };

  const instanceToOption = (
    instance: DataInstanceTO,
    dataFk: number
  ): DropdownItemProps => {
    const instanceId: string = dataFk + ":" + instance.id;
    return {
      key: instanceId,
      value: instanceId,
      text: instance.name,
    };
  };

  return { selectInstance, createOptions };
};
