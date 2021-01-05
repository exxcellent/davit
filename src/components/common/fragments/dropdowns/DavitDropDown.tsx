import React, { FunctionComponent } from 'react';
import { Dropdown, DropdownItemProps } from 'semantic-ui-react';
import '../../../../app/css/Davit.css';

export interface DavitDropDownItemProps {
    key: number;
    value: string;
    text: string;
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

export const DavitDropDown: FunctionComponent<DavitDropDownProps> = (props) => {
    const { dropdownItems, onSelect, placeholder, value, clearable, others } = props;

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
            options={dropdownItems.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))}
            onChange={(event, data) => onSelect(parsDataToDavitDropDownItemProps(data))}
            {...others}
        />
    );
};

export const DavitIconDropDown: FunctionComponent<DavitIconDropDownProps> = (props) => {
    const { dropdownItems, onSelect, icon } = props;

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

function parsDataToDavitDropDownItemProps(data: any): DavitDropDownItemProps {
    return {
        key: data.key ? data.key : -1,
        text: data.text ? data.text : '',
        value: data.value ? data.value.toString() : '',
    };
}
