import React, {FunctionComponent} from 'react';
import {Dropdown, DropdownItemProps, DropdownProps} from 'semantic-ui-react';

interface ColorDropDownProps extends DropdownProps {
  onSelect: (color: string | undefined) => void;
  placeholder?: string;
  colors: string[];
}

export const ColorDropDown: FunctionComponent<ColorDropDownProps> = (props) => {
  const {onSelect, placeholder, colors} = props;

  const colorToOption = (color: string): DropdownItemProps => {
    return {
      key: color,
      value: color,
      text: color,
    };
  };

  return (
    <Dropdown
      options={colors.map(colorToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      onChange={(event, data) => onSelect(data.value as string)}
      scrolling
      value={placeholder}
      floating
      compact
    />
  );
};
