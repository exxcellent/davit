import React, {FunctionComponent} from 'react';
import {Dropdown} from 'semantic-ui-react';
import '../../../../app/Davit.css';

export interface DavitDropDownItemProps{
  key: number,
  value: string,
  text: string,
}

export interface DavitDropDownProps {
  onSelect: (dropdownItem: DavitDropDownItemProps) => void;
  dropdownItems: DavitDropDownItemProps[];
  value?: string;
  placeholder?: string;
}

export interface DavitIconDropDownProps {
  onSelect: (dropdownItem: DavitDropDownItemProps) => void;
  dropdownItems: DavitDropDownItemProps[];
  icon?: string;
}

export interface DavitMultiselectDropDownProps {
  onSelect: (items: DavitDropDownItemProps[]) => void;
  dropdownItems: DavitDropDownItemProps[];
  selected: DavitDropDownItemProps[];
  placeholder?: string;
}

export const DavitDropDown: FunctionComponent<DavitDropDownProps> = (props) => {
  const {dropdownItems, onSelect, placeholder, value} = props;

  return (
    <Dropdown
      selection
      selectOnBlur={false}
      placeholder={placeholder || ''}
      scrolling
      value={value}
      disabled={dropdownItems.length < 1}
      search
      options={dropdownItems.sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      onChange={(event, data) => onSelect(parsDataToDavitDropDownItemProps(data))}
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
  const {onSelect, selected, placeholder, dropdownItems} = props;

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
      search
      value={selectedItemsToValuesArray(selected)}
      scrolling
      disabled={dropdownItems.length < 1}
      style={{overflow: 'auto'}}
      options={dropdownItems.sort(function(a, b) {
        return ('' + a.value).localeCompare(b.value);
      })}
      onChange={(event, datas) => {
        onSelect(datas.map((data: any) => parsDataToDavitDropDownItemProps(data)));
      }}
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
