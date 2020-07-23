import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { DATA_INSTANCE_ID_FACTOR } from "../../../../dataAccess/access/to/DataTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface MultiselectDataDropDownProps extends DropdownProps {
  onSelect: (dataIds: number[] | undefined) => void;
  selected: number[];
}

export const MultiselectDataDropDown: FunctionComponent<MultiselectDataDropDownProps> = (props) => {
  const { onSelect, selected } = props;
  const { datas, dataToOption } = useMultiSelectDataDropDownViewModel();

  return (
    <Dropdown
      placeholder="Select Datas ..."
      fluid
      multiple
      selection
      // options={datas.map(dataToOption)}
      options={([] as DropdownItemProps[]).concat.apply([], datas.map(dataToOption)).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      onChange={(event, data) => {
        onSelect((data.value as number[]) || undefined);
      }}
      value={selected}
      scrolling
    />
  );
};

const useMultiSelectDataDropDownViewModel = () => {
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

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

  return { datas, dataToOption };
};
