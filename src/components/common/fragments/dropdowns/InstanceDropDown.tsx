import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import { DataCTO } from '../../../../dataAccess/access/cto/DataCTO';
import { DataInstanceTO } from '../../../../dataAccess/access/to/DataInstanceTO';
import { masterDataSelectors } from '../../../../slices/MasterDataSlice';
import { DavitDropDown, DavitDropDownItemProps, DavitIconDropDown } from './DavitDropDown';

export interface DataAndInstanceId {
    dataFk: number;
    instanceId: number;
}

interface InstanceDropDownProps extends DropdownProps {
    onSelect: (dataAndInstance: DataAndInstanceId | undefined) => void;
    placeholder?: string;
    value?: string;
}

interface InstanceDropDownButtonProps extends DropdownProps {
    onSelect: (dataAndInstance: DataAndInstanceId | undefined) => void;
    icon?: string;
}

interface InstanceDropDownMultiselectProps extends DropdownProps {
    onSelect: (dataAndInstaces: DataAndInstanceId[] | undefined) => void;
    selected: DataAndInstanceId[];
    placeholder?: string;
}

export const InstanceDropDown: FunctionComponent<InstanceDropDownProps> = (props) => {
    const { onSelect, placeholder, value } = props;
    const { selectInstance, createOptions } = useInstanceDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={createOptions()}
            placeholder={placeholder}
            onSelect={(instance) => onSelect(selectInstance(instance.value))}
            value={value !== '' ? value : undefined}
        />
    );
};

export const InstanceDropDownButton: FunctionComponent<InstanceDropDownButtonProps> = (props) => {
    const { onSelect, icon } = props;
    const { selectInstance, createOptions } = useInstanceDropDownViewModel();

    return (
        <DavitIconDropDown
            dropdownItems={createOptions()}
            icon={icon}
            onSelect={(instance) => onSelect(selectInstance(instance.value))}
        />
    );
};

export const InstanceDropDownMultiselect: FunctionComponent<InstanceDropDownMultiselectProps> = (props) => {
    const { onSelect, selected, placeholder } = props;
    const { selectInstances, createOptions } = useInstanceDropDownViewModel();

    return (
        <Dropdown
            placeholder={placeholder || 'Select Datas ...'}
            fluid
            multiple
            selection
            options={createOptions()}
            onChange={(event, instances) => {
                onSelect(selectInstances((instances.value as string[]) || undefined));
            }}
            value={selected.map((select) => JSON.stringify(select))}
            scrolling
            disabled={createOptions().length > 0 ? false : true}
        />
    );
};

const useInstanceDropDownViewModel = () => {
    const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

    const selectInstance = (optionItemString: string): DataAndInstanceId | undefined => {
        if (optionItemString !== null && datas !== null) {
            const optionItem: DataAndInstanceId = JSON.parse(optionItemString);
            return optionItem;
        }
        return undefined;
    };

    const selectInstances = (optionItemStrings: string[] | undefined): DataAndInstanceId[] => {
        const dataAndInstanceIds: DataAndInstanceId[] = [];
        if (optionItemStrings) {
            optionItemStrings.forEach((op) => {
                const dataInst: DataAndInstanceId | undefined = selectInstance(op);
                if (dataInst) {
                    dataAndInstanceIds.push(dataInst);
                }
            });
        }
        return dataAndInstanceIds;
    };

    const createOptions = (): DavitDropDownItemProps[] => {
        const dropdownItemas: DavitDropDownItemProps[] = [];
        if (datas) {
            datas.forEach((data) => {
                data.data.instances.forEach((inst) => {
                    dropdownItemas.push(instanceToOption(inst, data, data.data.id * 100 + inst.id));
                });
            });
        }
        return dropdownItemas;
    };

    const instanceToOption = (instance: DataInstanceTO, data: DataCTO, key: number): DavitDropDownItemProps => {
        const optionItem: DataAndInstanceId = { dataFk: data.data.id, instanceId: instance.id };
        const optionItemString: string = JSON.stringify(optionItem);
        let optionLabel: string = data.data.name;
        if (instance.id !== -1) {
            optionLabel = optionLabel + ' - ' + instance.name;
        }
        return {
            key: key,
            value: optionItemString,
            text: optionLabel,
        };
    };

    return { selectInstance, selectInstances, createOptions };
};
