import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../../dataAccess/access/cto/DataCTO";
import { selectComponents } from "../../../../../../metaComponentModel/viewModel/MetaComponentModelSlice";
import { selectDatas } from "../../../../../../metaDataModel/viewModel/MetaDataModelSlice";

interface Carv2DropdownProps extends DropdownProps {}

export const Carv2Dropdown: FunctionComponent<Carv2DropdownProps> = (props) => {
  return <Dropdown {...props.other} />;
};

export const useGetComponentDropdown = (
  onSelect: (component: ComponentCTO | undefined) => void,
  icon?: string
) => {
  const components: ComponentCTO[] = useSelector(selectComponents);

  const componentToOption = (component: ComponentCTO): DropdownItemProps => {
    return {
      key: component.component.id,
      value: component.component.id,
      text: component.component.name,
    };
  };

  const selectComponent = (id: number) => {
    onSelect(components.find((component) => component.component.id === id));
  };

  return (
    <Dropdown
      options={components.map(componentToOption)}
      icon={icon}
      placeholder="Select Component"
      selection
      onChange={(event, data) => selectComponent(Number(data.value))}
      labeled
      className="icon"
      floating
      button
    />
  );
};

export const useGetDataDropdown = (
  onSelect: (data: DataCTO | undefined) => void,
  icon?: string
) => {
  const datas: DataCTO[] = useSelector(selectDatas);

  const dataToOption = (data: DataCTO): DropdownItemProps => {
    return {
      key: data.data.id,
      value: data.data.id,
      text: data.data.name,
    };
  };

  const selectData = (id: number) => {
    onSelect(datas.find((data) => data.data.id === id));
  };

  return (
    <Dropdown
      options={datas.map(dataToOption)}
      icon={icon}
      placeholder="Select Data"
      selection
      onChange={(event, data) => selectData(Number(data.value))}
      labeled
      className="icon"
      floating
      button
    />
  );
};
