import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface MultiselectDataDropDownProps extends DropdownProps {
  onSelect: (data: DataCTO[] | undefined) => void;
  selected: number[];
}

export const MultiselectDataDropDown: FunctionComponent<MultiselectDataDropDownProps> = (props) => {
  const { onSelect, selected } = props;
  const { datas, selectDataOptions, dataToOption } = useMultiSelectDataDropDownViewModel();

  return (
    <Dropdown
      placeholder="Select Datas ..."
      fluid
      multiple
      selection
      options={datas.map(dataToOption)}
      onChange={(event, data) => {
        onSelect(selectDataOptions((data.value as number[]) || undefined, datas));
      }}
      value={selected}
      scrolling
    />
  );
};

const useMultiSelectDataDropDownViewModel = () => {
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

  const selectDataOptions = (dataIds: number[] | undefined, datas: DataCTO[]): DataCTO[] => {
    let dataToReturn: DataCTO[] = [];
    if (dataIds !== undefined && !isNullOrUndefined(datas)) {
      dataIds.map((id) => dataToReturn.push(datas.find((data) => data.data.id === id)!));
    }
    return dataToReturn;
  };

  const dataToOption = (data: DataCTO): DropdownItemProps => {
    return {
      key: data.data.id,
      value: data.data.id,
      text: data.data.name,
    };
  };

  return { datas, selectDataOptions, dataToOption };
};
