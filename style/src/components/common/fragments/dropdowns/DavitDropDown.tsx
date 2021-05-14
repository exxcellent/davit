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

export interface DavitLabelDropDownProps {
    onSelect: (dropdownItem: DavitDropDownItemProps) => void;
    dropdownItems: DavitDropDownItemProps[];
    label?: string;
}

interface ReactSelectOption {
    value: string;
    label: string;
}

export const DavitDropDown: FunctionComponent<DavitDropDownProps> = (props) => {
    const {dropdownItems, onSelect, placeholder, value, clearable} = props;


    return (
        <Select
            classNamePrefix={"react-select"}
            className={"react-select-container"}
            isClearable={clearable}
            placeholder={placeholder}
            value={getSelectedValue(value, dropdownItems)}
            options={dropdownItems.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase())).map(dropdownItemToOption)}
            onChange={(value) => handleOnChange(value, onSelect)}
        />
    );
};

export const DavitLabelDropDown: FunctionComponent<DavitLabelDropDownProps> = (props) => {
        const {dropdownItems, onSelect, label} = props;

        return (
            <Select
                classNamePrefix={"react-select"}
                className={"react-select-container"}
                value={{value: label, label: label}}
                options={dropdownItems.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase())).map(dropdownItemToOption)}
                onChange={(value) => handleOnChange(value, onSelect)}
                isSearchable={false}
            />
        );
    }
;

const parsDataToDavitDropDownItemProps = (data: ReactSelectOption): DavitDropDownItemProps => {
    console.info("parsing data: ", data);
    return {
        key: -1,
        text: data.label ? data.label : "",
        value: data.value ? data.value : "",
    };
};

const dropdownItemToOption = (dropdownItem: DavitDropDownItemProps): ReactSelectOption => {
    return {value: dropdownItem.value, label: dropdownItem.text};
};

const handleOnChange = (value: any, onSelect: (dropdownItem: DavitDropDownItemProps) => void) => {
    if (value !== null) {
        const option: DavitDropDownItemProps = parsDataToDavitDropDownItemProps(value);
        onSelect(option);
    } else {
        onSelect({key: -1, value: "", text: ""});
    }
};

const getSelectedValue = (value: string | undefined, dropdownItems: DavitDropDownItemProps[]): ReactSelectOption => {
    let selectedValue: ReactSelectOption = {value: "", label: ""};

    if (value) {

        const option: DavitDropDownItemProps | undefined = dropdownItems.find(option => option.value === value);

        if (option) {
            selectedValue.value = option.value;
            selectedValue.label = option.text;
        }
    }
    return selectedValue;
};
