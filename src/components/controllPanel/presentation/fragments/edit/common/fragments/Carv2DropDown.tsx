import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../../../../dataAccess/access/cto/DataRelationCTO";
import { selectComponents } from "../../../../../../metaComponentModel/viewModel/MetaComponentModelSlice";
import {
  selectDataRelations,
  selectDatas,
} from "../../../../../../metaDataModel/viewModel/MetaDataModelSlice";

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
      // placeholder="Select Component"
      // selection
      onChange={(event, data) => selectComponent(Number(data.value))}
      // labeled
      className="button icon"
      floating
      // button
      trigger={<React.Fragment />}
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
      // placeholder="Select Data"
      // selection
      onChange={(event, data) => selectData(Number(data.value))}
      // labeled
      className="button icon"
      inverted="true"
      color="orange"
      floating
      // button
      trigger={<React.Fragment />}
    />
  );
};

export const useGetRelationDropdown = (
  onSelect: (relation: DataRelationCTO | undefined) => void,
  icon?: string
) => {
  const relations: DataRelationCTO[] = useSelector(selectDataRelations);

  const relationToOption = (relation: DataRelationCTO): DropdownItemProps => {
    const text: string =
      relation.dataCTO1.data.name + " - " + relation.dataCTO2.data.name;
    return {
      key: relation.dataRelationTO.id,
      value: relation.dataRelationTO.id,
      text: text,
    };
  };

  const selectDataRelation = (id: number) => {
    onSelect(relations.find((relation) => relation.dataRelationTO.id === id));
  };

  return (
    <Dropdown
      options={relations.map(relationToOption)}
      icon={icon}
      // placeholder="Select Data"
      // selection
      onChange={(event, data) => selectDataRelation(Number(data.value))}
      // labeled
      className="button icon"
      inverted="true"
      color="orange"
      floating
      // button
      trigger={<React.Fragment />}
    />
  );
};
