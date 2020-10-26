import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import { isNullOrUndefined } from 'util';

import { ActorCTO } from '../../../../dataAccess/access/cto/ActorCTO';
import { masterDataSelectors } from '../../../../slices/MasterDataSlice';

interface ComponentDropDownProps extends DropdownProps {
  onSelect: (component: ActorCTO | undefined) => void;
  placeholder?: string;
  value?: number;
}

interface ComponentDropDownButtonProps extends DropdownProps {
  onSelect: (component: ActorCTO | undefined) => void;
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
      value={value === -1 ? undefined : value}
      disabled={components.length > 0 ? false : true}
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
      icon={components.length > 0 ? icon : ""}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectComponent(Number(data.value), components))}
      className="button icon"
      trigger={<React.Fragment />}
      scrolling
      disabled={components.length > 0 ? false : true}
    />
  );
};

const useComponentDropDownViewModel = () => {
  const components: ActorCTO[] = useSelector(masterDataSelectors.components);

  const componentToOption = (component: ActorCTO): DropdownItemProps => {
    return {
      key: component.component.id,
      value: component.component.id,
      text: component.component.name,
    };
  };

  const selectComponent = (componentId: number, components: ActorCTO[]): ActorCTO | undefined => {
    if (!isNullOrUndefined(components) && !isNullOrUndefined(componentId)) {
      return components.find((component) => component.component.id === componentId);
    }
    return undefined;
  };

  return { components, componentToOption, selectComponent };
};
