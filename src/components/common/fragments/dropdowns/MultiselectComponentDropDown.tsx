import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, DropdownItemProps, DropdownProps } from 'semantic-ui-react';

import { ComponentCTO } from '../../../../dataAccess/access/cto/ActorCTO';
import { masterDataSelectors } from '../../../../slices/MasterDataSlice';

interface MultiselectComponentDropDownProps extends DropdownProps {
  onSelect: (dataIds: number[] | undefined) => void;
  selected: number[];
  placeholder?: string;
}

export const MultiselectComponentDropDown: FunctionComponent<MultiselectComponentDropDownProps> = (props) => {
  const { onSelect, selected, placeholder } = props;
  const { components, componentToOption } = useMultiselectComponentDropDownViewModel();

  return (
    <Dropdown
      placeholder={placeholder || "Select Components ..."}
      fluid
      multiple
      selection
      options={([] as DropdownItemProps[]).concat.apply([], components.map(componentToOption)).sort(function (a, b) {
        return ("" + a.attr).localeCompare(b.attr);
      })}
      onChange={(event, data) => {
        onSelect((data.value as number[]) || undefined);
      }}
      value={selected}
      scrolling
      disabled={components.length > 0 ? false : true}
      style={{ overflow: "auto" }}
    />
  );
};

const useMultiselectComponentDropDownViewModel = () => {
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);

  const componentToOption = (component: ComponentCTO): DropdownItemProps[] => {
    return [
      {
        key: component.component.id,
        value: component.component.id,
        text: component.component.name,
      },
    ];
  };

  return { components, componentToOption };
};
