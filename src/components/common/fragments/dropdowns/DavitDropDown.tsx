import React, { FunctionComponent } from 'react';
import { Dropdown } from 'semantic-ui-react';

export interface DavitDropDownItemProps{
  key: any,
  value: string,
  text: string,
}

export interface DavitDropDownProps {
  dropdownItems: DavitDropDownItemProps[];
  onSelect: (dropdownItem: DavitDropDownItemProps) => void;
  placeholder?: string;
  value?: number;
}

export interface DavitIconDropDownProps {
  dropdownItems: DavitDropDownItemProps[];
  onSelect: (dropdownItem: DavitDropDownItemProps) => void;
  icon?: string;
}

export interface DavitMultiselectDropDownProps {
  dropdownItems: DavitDropDownItemProps[];
  onSelect: (items: number[] | undefined) => void;
  selected: number[];
  placeholder?: string;
}

export const DavitDropDown: FunctionComponent<DavitDropDownProps> = (props) => {
  const {dropdownItems, onSelect, placeholder} = props;

  return (
    <Dropdown
      options={dropdownItems.sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      placeholder={placeholder || ''}
      onChange={(event, data) => onSelect(data)}
      trigger={<React.Fragment />}
      scrolling
      // TODO: find best type
      // value={value === -1 ? undefined : value}
      disabled={dropdownItems.length > 0 ? false : true}
      search
    />
  );
};

export const DavitIconDropDown: FunctionComponent<DavitIconDropDownProps> = (props) => {
  const {dropdownItems, onSelect, icon} = props;

  return (
    <Dropdown
      options={dropdownItems.sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      icon={dropdownItems.length > 0 ? icon : ''}
      selectOnBlur={false}
      onChange={(event, data) => onSelect()}
      className="button icon"
      trigger={<React.Fragment />}
      scrolling
      disabled={dropdownItems.length > 0 ? false : true}
      search
    />
  );
};

export const DavitMultiselectDropDown: FunctionComponent<DavitMultiselectDropDownProps> = (props) => {
  const {onSelect, selected, placeholder, dropdownItems} = props;

  return (
    <Dropdown
      placeholder={placeholder || ''}
      fluid
      multiple
      selection
      search
      options={.sort(function(a, b) {
        return ('' + a.attr).localeCompare(b.attr);
      })}
      onChange={(event, data) => {
        onSelect((data.value as number[]) || undefined);
      }}
      value={selected}
      scrolling
      disabled={dropdownItems.length > 0 ? false : true}
      style={{overflow: 'auto'}}
    />
  );
};
