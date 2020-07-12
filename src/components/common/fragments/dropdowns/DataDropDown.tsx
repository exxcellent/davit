import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface DataDropDownProps extends DropdownProps {
  onSelect: (data: DataCTO | undefined) => void;
  placeholder?: string;
  value?: number;
}

interface DataDropDownButtonProps extends DropdownProps {
  onSelect: (data: DataCTO | undefined) => void;
  icon?: string;
}

export const DataDropDown: FunctionComponent<DataDropDownProps> = (props) => {
  const { onSelect, placeholder, value } = props;
  const { datas, selectData, dataToOption } = useDataDropDownViewModel();

  return (
    <Dropdown
      options={datas.map(dataToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      placeholder={placeholder || "Select Data ..."}
      onChange={(event, data) => onSelect(selectData(Number(data.value), datas))}
      selectOnBlur={false}
      scrolling
      selection
      value={value === -1 ? undefined : value}
    />
  );
};

export const DataDropDownButton: FunctionComponent<DataDropDownButtonProps> = (props) => {
  const { onSelect, icon } = props;
  const { datas, selectData, dataToOption } = useDataDropDownViewModel();

  return (
    <Dropdown
      options={datas.map(dataToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      icon={icon}
      onChange={(event, data) => onSelect(selectData(Number(data.value), datas))}
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
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

  const selectData = (dataId: number, datas: DataCTO[]): DataCTO | undefined => {
    if (!isNullOrUndefined(dataId) && !isNullOrUndefined(datas)) {
      return datas.find((data) => data.data.id === dataId);
    }
    return undefined;
  };

  const dataToOption = (data: DataCTO): DropdownItemProps => {
    return {
      key: data.data.id,
      value: data.data.id,
      text: data.data.name,
    };
  };

  return { datas, selectData, dataToOption };
};
