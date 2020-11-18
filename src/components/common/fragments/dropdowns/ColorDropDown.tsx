import React, { FunctionComponent } from 'react';
import { DropdownProps } from 'semantic-ui-react';
import { DavitDropDown, DavitDropDownItemProps } from './DavitDropDown';

interface ColorDropDownProps extends DropdownProps {
    onSelect: (color: string | undefined) => void;
    placeholder?: string;
    colors: string[];
    value?: string;
}

export const ColorDropDown: FunctionComponent<ColorDropDownProps> = (props) => {
    const { onSelect, placeholder, colors, value } = props;

    const colorToOption = (color: string, key: number): DavitDropDownItemProps => {
        return {
            key: key,
            value: color,
            text: color,
        };
    };

    return (
        <DavitDropDown
            dropdownItems={colors.map((color, index) => colorToOption(color, index))}
            onSelect={(color) => onSelect(color.value)}
            placeholder={placeholder}
            value={value}
        />
    );
};
