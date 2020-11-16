import React, {FunctionComponent} from 'react';
import {Dropdown, DropdownItemProps} from 'semantic-ui-react';
import '../../../../app/Davit.css';

export interface DavitDropDownItemProps{
  key: number,
  value: string,
  text: string,
}

export interface DavitDropDownProps extends DropdownItemProps {
  onSelect: (dropdownItem: DavitDropDownItemProps) => void;
  dropdownItems: DavitDropDownItemProps[];
  value?: string;
  placeholder?: string;
}

export interface DavitIconDropDownProps extends DropdownItemProps {
  onSelect: (dropdownItem: DavitDropDownItemProps) => void;
  dropdownItems: DavitDropDownItemProps[];
  icon?: string;
}

export interface DavitMultiselectDropDownProps extends DropdownItemProps {
  onSelect: (items: string[]) => void;
  dropdownItems: DavitDropDownItemProps[];
  selection: string[];
  placeholder?: string;
}

export const DavitDropDown: FunctionComponent<DavitDropDownProps> = (props) => {
  const {dropdownItems, onSelect, placeholder, value, clearable, others} = props;

  return (
    <Dropdown
      selection
      selectOnBlur={false}
      placeholder={placeholder || ''}
      scrolling
      value={value}
      disabled={dropdownItems.length < 1}
      search
      clearable={clearable ? clearable : false}
      options={dropdownItems.sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      onChange={(event, data) => onSelect(parsDataToDavitDropDownItemProps(data))}
      {...others}
    />
  );
};

export const DavitIconDropDown: FunctionComponent<DavitIconDropDownProps> = (props) => {
  const {dropdownItems, onSelect, icon} = props;

  return (
    <Dropdown
      icon={dropdownItems.length > 0 ? icon : ''}
      selectOnBlur={false}
      className="button icon"
      trigger={<React.Fragment />}
      scrolling
      disabled={dropdownItems.length < 1}
      options={dropdownItems.sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      onChange={(event, data) => onSelect(parsDataToDavitDropDownItemProps(data))}
    />
  );
};

export const DavitMultiselectDropDown: FunctionComponent<DavitMultiselectDropDownProps> = (props) => {
  const {onSelect, selection: selected, placeholder, dropdownItems} = props;

  function selectedItemsToValuesArray(selected: DavitDropDownItemProps[]): string[] {
    const valueNumbers: string[] = [];
    selected.forEach((item) => {
      valueNumbers.push(item.value);
    });
    valueNumbers.sort((a, b) => {
      return a < b ? -1 : a > b ? 1 : 0;
    });
    return valueNumbers;
  }

  return (
    <Dropdown
      placeholder={placeholder || ''}
      fluid
      multiple
      selection
      // value={selectedItemsToValuesArray(selected)}
      scrolling
      disabled={dropdownItems.length < 1}
      // style={{overflow: 'auto'}}
      options={dropdownItems.sort(function(a, b) {
        return ('' + a.value).localeCompare(b.value);
      })}
      // onChange={(event, datas) => {
      //   console.info('datas: ', datas);
      //   onSelect((datas.value as string[])
      // }}
    />
  );
};

function parsDataToDavitDropDownItemProps(data: any): DavitDropDownItemProps {
  return {
    key: data.key ? data.key : -1,
    text: data.text ? data.text : '',
    value: data.value ? data.value.toString() : '',
  };
}
