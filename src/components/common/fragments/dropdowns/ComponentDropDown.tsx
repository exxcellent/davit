import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { selectComponents } from "../../../../slices/ComponentSlice";

interface ComponentDropDownProps extends DropdownProps {
  onSelect: (component: ComponentCTO | undefined) => void;
  placeholder?: string;
  value?: number;
}

interface ComponentDropDownButtonProps extends DropdownProps {
  onSelect: (component: ComponentCTO | undefined) => void;
  icon?: string;
}

export const ComponentDropDown: FunctionComponent<ComponentDropDownProps> = (props) => {
  const { onSelect, placeholder, value } = props;
  const { components, componentToOption, selectComponent } = useComponentDropDownViewModel();

  return (
    <Dropdown
      options={components.map(componentToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      placeholder={placeholder || "Select Component ..."}
      onChange={(event, data) => onSelect(selectComponent(Number(data.value), components))}
      scrolling
      value={value}
    />
  );
};

export const ComponentDropDownButton: FunctionComponent<ComponentDropDownButtonProps> = (props) => {
  const { onSelect, icon } = props;
  const { components, componentToOption, selectComponent } = useComponentDropDownViewModel();

  return (
    <Dropdown
      options={components.map(componentToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      icon={icon}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectComponent(Number(data.value), components))}
      className="button icon"
      trigger={<React.Fragment />}
      scrolling
    />
  );
};

const useComponentDropDownViewModel = () => {
  const components: ComponentCTO[] = useSelector(selectComponents);

  const componentToOption = (component: ComponentCTO): DropdownItemProps => {
    return {
      key: component.component.id,
      value: component.component.id,
      text: component.component.name,
    };
  };

  const selectComponent = (componentId: number, components: ComponentCTO[]): ComponentCTO | undefined => {
    if (!isNullOrUndefined(components) && !isNullOrUndefined(componentId)) {
      return components.find((component) => component.component.id === componentId);
    }
    return undefined;
  };

  return { components, componentToOption, selectComponent };
};
