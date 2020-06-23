import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { selectDatas } from "../../../../slices/DataSlice";

interface MultiselectDataDropDownProps extends DropdownProps {
  onSelect: (data: DataCTO | undefined) => void;
}

export const MultiselectDataDropDown: FunctionComponent<MultiselectDataDropDownProps> = (props) => {
  const { onSelect } = props;
  const { datas, selectData, dataToOption } = useDataDropDownViewModel();

  return <Dropdown placeholder="Select Data..." fluid multiple selection options={datas.map(dataToOption)} />;
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
