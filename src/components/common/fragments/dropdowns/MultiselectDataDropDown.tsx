import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface MultiselectDataDropDownProps extends DropdownProps {
  onSelect: (dataIds: number[] | undefined) => void;
  selected: number[];
  placeholder?: string;
}

export const MultiselectDataDropDown: FunctionComponent<MultiselectDataDropDownProps> = (props) => {
  const { onSelect, selected, placeholder } = props;
  const { datas, dataToOption } = useMultiSelectDataDropDownViewModel();

  return (
    <Dropdown
      placeholder={placeholder || "Select Datas ..."}
      fluid
      multiple
      selection
      options={([] as DropdownItemProps[]).concat.apply([], datas.map(dataToOption)).sort(function (a, b) {
        return ("" + a.attr).localeCompare(b.attr);
      })}
      onChange={(event, data) => {
        onSelect((data.value as number[]) || undefined);
      }}
      value={selected}
      scrolling
      disabled={datas.length > 0 ? false : true}
    />
  );
};

const useMultiSelectDataDropDownViewModel = () => {
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

  const dataToOption = (data: DataCTO): DropdownItemProps[] => {
    if (data.instances.length === 0) {
      return [
        {
          key: data.data.id,
          value: data.data.id,
          text: data.data.name,
        },
      ];
    } else {
      return data.instances.map((instance) => {
        return {
          key: instance.id,
          value: instance.id,
          text: `${data.data.name}: ${instance.name}`,
        };
      });
    }
  };

  return { datas, dataToOption };
};
