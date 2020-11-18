import React, { FunctionComponent } from 'react';
import { DropdownProps } from 'semantic-ui-react';
import { DataInstanceTO } from '../../../../dataAccess/access/to/DataInstanceTO';
import { DavitDropDown, DavitDropDownItemProps, DavitIconDropDown } from './DavitDropDown';

interface DataInstanceDropDownProps extends DropdownProps {
    onSelect: (id: number | undefined) => void;
    instances: DataInstanceTO[];
    placeholder?: string;
    value?: number;
}

interface DataInstanceDropDownButtonProps extends DropdownProps {
    onSelect: (id: number | undefined) => void;
    instances: DataInstanceTO[];
    icon?: string;
}

/**
 * List's all instances of a data object.
 */
export const DataInstanceDropDown: FunctionComponent<DataInstanceDropDownProps> = (props) => {
    const { onSelect, placeholder, value, instances } = props;
    const { dataInstacesToOption } = useDataInstanceDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={dataInstacesToOption(instances)}
            onSelect={(instance) => onSelect(Number(instance.value))}
            placeholder={placeholder}
            value={value?.toString()}
        />
    );
};

export const DataInstanceDropDownButton: FunctionComponent<DataInstanceDropDownButtonProps> = (props) => {
    const { onSelect, instances, icon } = props;
    const { dataInstacesToOption } = useDataInstanceDropDownViewModel();

    return (
        <DavitIconDropDown
            dropdownItems={dataInstacesToOption(instances)}
            onSelect={(instance) => onSelect(Number(instance.value))}
            icon={icon}
        />
    );
};

const useDataInstanceDropDownViewModel = () => {
    const dataInstacesToOption = (instances: DataInstanceTO[]): DavitDropDownItemProps[] => {
        const dropdownItemProps: DavitDropDownItemProps[] = [];
        instances.forEach((instanc) =>
            dropdownItemProps.push({
                key: instanc.id,
                value: instanc.id.toString(),
                text: instanc.name,
            }),
        );
        return dropdownItemProps;
    };

    return { dataInstacesToOption };
};
