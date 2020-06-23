import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { selectDatas } from "../../../../slices/DataSlice";

interface DataDropDownProps extends DropdownProps {
  onSelect: (data: DataCTO | undefined) => void;
  placeholder?: string;
  icon?: string;
}

export const DataDropDown: FunctionComponent<DataDropDownProps> = (props) => {
  const { onSelect, placeholder, icon } = props;
  const { datas, selectData, dataToOption } = useDataDropDownViewModel();

  return (
    <>
      {placeholder && (
        <Dropdown
          options={datas.map(dataToOption).sort((a, b) => {
            return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
          })}
          placeholder={placeholder}
          onChange={(event, data) => onSelect(selectData(Number(data.value), datas))}
          selectOnBlur={false}
          scrolling
          selection
        />
      )}
      {icon && (
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
      )}
    </>
  );
};

const useDataDropDownViewModel = () => {
  const datas: DataCTO[] = useSelector(selectDatas);

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
