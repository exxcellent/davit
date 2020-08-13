import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import {
  DataInstanceTO,
  DATA_INSTANCE_ID_FACTOR,
  getDataAndInstanceIds,
} from "../../../../dataAccess/access/to/DataTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface DataAndInstanceDropDownProps extends DropdownProps {
  onSelect: (values: { data?: DataCTO; instance?: DataInstanceTO } | undefined) => void;
  placeholder?: string;
  value?: number;
}

interface DataAndInstanceDropDownButtonProps extends DropdownProps {
  onSelect: (values: { data?: DataCTO; instance?: DataInstanceTO } | undefined) => void;
  icon?: string;
}

export const DataAndInstanceDropDown: FunctionComponent<DataAndInstanceDropDownProps> = (props) => {
  const { onSelect, placeholder, value } = props;
  const { datas, selectData, dataToOption } = useDataDropDownViewModel();

  return (
    <Dropdown
      options={([] as DropdownItemProps[]).concat.apply([], datas.map(dataToOption)).sort(function (a, b) {
        return ("" + a.attr).localeCompare(b.attr);
      })}
      placeholder={placeholder || "Select Data ..."}
      onChange={(event, data) => onSelect(selectData(Number(data.value), datas))}
      selectOnBlur={false}
      scrolling
      selection
      value={value === -1 ? undefined : value}
      disabled={datas.length > 0 ? false : true}
    />
  );
};

export const DataDropDownButton: FunctionComponent<DataAndInstanceDropDownButtonProps> = (props) => {
  const { onSelect, icon } = props;
  const { datas, selectData, dataToOption } = useDataDropDownViewModel();

  return (
    <Dropdown
      options={([] as DropdownItemProps[]).concat
        .apply([] as DropdownItemProps[], datas.map(dataToOption))
        .sort((a, b) => {
          return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
        })}
      icon={datas.length > 0 ? icon : ""}
      onChange={(event, data) => onSelect(selectData(Number(data.value), datas))}
      className="button icon"
      inverted="true"
      color="orange"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={datas.length > 0 ? false : true}
    />
  );
};

const useDataDropDownViewModel = () => {
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

  const selectData = (dataId: number, datas: DataCTO[]): { data?: DataCTO; instance?: DataInstanceTO } | undefined => {
    if (!isNullOrUndefined(dataId) && !isNullOrUndefined(datas)) {
      if (dataId < DATA_INSTANCE_ID_FACTOR) {
        return { data: datas.find((data) => data.data.id === dataId) };
      } else {
        const ids = getDataAndInstanceIds(dataId);
        const data = datas.find((data) => data.data.id === ids.dataId);
        return data
          ? {
              data: data,
              instance: data.data.inst.find((instance) => instance.id === ids.instanceId),
            }
          : undefined;
      }
    } else {
      return undefined;
    }
  };

  const dataToOption = (data: DataCTO): DropdownItemProps[] => {
    if (data.data.inst.length === 0) {
      return [
        {
          key: data.data.id,
          value: data.data.id,
          text: data.data.name,
        },
      ];
    } else {
      return data.data.inst.map((instance) => {
        const value = data.data.id * DATA_INSTANCE_ID_FACTOR + instance.id;
        return {
          key: value,
          value: value,
          text: `${data.data.name}: ${instance.name}`,
        };
      });
    }
  };

  return { datas, selectData, dataToOption };
};
