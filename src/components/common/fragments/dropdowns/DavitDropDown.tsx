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

interface ReactSelectOption {
    value: string;
    label: string;
}

export const DavitDropDown: FunctionComponent<DavitDropDownProps> = (props) => {
    const {dropdownItems, onSelect, placeholder, value, clearable} = props;

    const dropdownItemToOption = (dropdownItem: DavitDropDownItemProps): ReactSelectOption => {
        return {value: dropdownItem.value, label: dropdownItem.text};
    };

    const handleOnChange = (value: any) => {
        if (value !== null) {
            const option: DavitDropDownItemProps = parsDataToDavitDropDownItemProps(value);
            onSelect(option);
        } else {
            onSelect({key: -1, value: "", text: ""});
        }
    };

    const getSelectedValue = (value: string | undefined): ReactSelectOption => {
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


    return (
        <Select
            classNamePrefix={"react-select"}
            className={"react-select-container"}
            isClearable={clearable}
            placeholder={placeholder}
            value={getSelectedValue(value)}
            options={dropdownItems.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase())).map(dropdownItemToOption)}
            onChange={handleOnChange}
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

const parsDataToDavitDropDownItemProps = (data: ReactSelectOption): DavitDropDownItemProps => {
    console.info("parsing data: ", data);
    return {
        key: -1,
        text: data.label ? data.label : "",
        value: data.value ? data.value : "",
    };
};
