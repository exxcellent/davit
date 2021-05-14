import React, {FunctionComponent} from "react";
import "../../../../app/css/Davit.css";
import Select from 'react-select';
import "../../../../app/css/React-Select.css";

export interface DavitDropDownItemProps {
    key: number;
    value: string;
    text: string;
}

export interface DavitDropDownProps {
    onSelect: (dropdownItem: DavitDropDownItemProps) => void;
    dropdownItems: DavitDropDownItemProps[];
    value?: string;
    placeholder?: string;
    clearable?: boolean;
}

export interface DavitIconDropDownProps {
    onSelect: (dropdownItem: DavitDropDownItemProps) => void;
    dropdownItems: DavitDropDownItemProps[];
    icon?: string;
}

export const DavitDropDown: FunctionComponent<DavitDropDownProps> = (props) => {
    const {dropdownItems, onSelect, placeholder, value, clearable} = props;

    const dropdownItemToOption = (dropdownItem: DavitDropDownItemProps) => {
        return {value: dropdownItem.value, label: dropdownItem.text};
    };

    return (
        // <Dropdown
        //     selection
        //     selectOnBlur={false}
        //     placeholder={placeholder || ""}
        //     scrolling
        //     value={value}
        //     disabled={dropdownItems.length < 1}
        //     search
        //     clearable={clearable ? clearable : false}
        //     options={dropdownItems.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))}
        //     onChange={(event, data) => onSelect(parsDataToDavitDropDownItemProps(data))}
        //     {...others}
        // />
        <Select
            classNamePrefix={"react-select"}
            className={"react-select-container"}
            isClearable={clearable}
            placeholder={placeholder}
            value={{value: value}}
            options={dropdownItems.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase())).map(dropdownItemToOption)}
            onChange={(event, data) => {
                console.info("Call on Change in dropdown.");
                onSelect(parsDataToDavitDropDownItemProps(data));
            }}
        />
    );
};

export const DavitIconDropDown: FunctionComponent<DavitIconDropDownProps> = (props) => {
        // const {dropdownItems, onSelect, icon} = props;

        return (
            <div/>
            // <Dropdown
            //     // icon={dropdownItems.length > 0 ? icon : ""}
            //     icon={icon}
            //     selectOnBlur={false}
            //     className="button icon"
            //     trigger={<React.Fragment/>}
            //     scrolling
            //     // disabled={dropdownItems.length < 1}
            //     options={dropdownItems.sort((a, b) => {
            //         return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
            //     })}
            //     onChange={(event, data) => onSelect(parsDataToDavitDropDownItemProps(data))}
            // />
        );
    }
;

const parsDataToDavitDropDownItemProps = (data: any): DavitDropDownItemProps => {
    return {
        key: data.key ? data.key : -1,
        text: data.text ? data.text : "",
        value: data.value ? data.value.toString() : "",
    };
};
