import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { DropdownProps } from 'semantic-ui-react';
import { DataCTO } from '../../../../dataAccess/access/cto/DataCTO';
import { masterDataSelectors } from '../../../../slices/MasterDataSlice';
import { DavitUtil } from '../../../../utils/DavitUtil';
import { DavitDropDown, DavitDropDownItemProps, DavitIconDropDown } from './DavitDropDown';

interface DataDropDownProps extends DropdownProps {
    onSelect: (data: DataCTO | undefined) => void;
    placeholder?: string;
    value?: number;
}

interface DataDropDownButtonProps extends DropdownProps {
    onSelect: (data: DataCTO | undefined) => void;
    icon?: string;
}

export const DataDropDown: FunctionComponent<DataDropDownProps> = (props) => {
    const { onSelect, placeholder, value } = props;
    const { datas, selectData, dataToOption } = useDataDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={datas.map(dataToOption)}
            placeholder={placeholder}
            value={value?.toString()}
            onSelect={(data) => onSelect(selectData(Number(data.value), datas))}
        />
    );
};

export const DataDropDownButton: FunctionComponent<DataDropDownButtonProps> = (props) => {
    const { onSelect, icon } = props;
    const { datas, selectData, dataToOption } = useDataDropDownViewModel();

    return (
        <DavitIconDropDown
            dropdownItems={datas.map(dataToOption)}
            onSelect={(data) => onSelect(selectData(Number(data.value), datas))}
            icon={icon}
        />
    );
};

const useDataDropDownViewModel = () => {
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);

    const selectData = (dataId: number, datas: DataCTO[]): DataCTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(dataId) && !DavitUtil.isNullOrUndefined(datas)) {
            return datas.find((data) => data.data.id === dataId);
        }
        return undefined;
    };

    const dataToOption = (data: DataCTO): DavitDropDownItemProps => {
        return {
            key: data.data.id,
            value: data.data.id.toString(),
            text: data.data.name,
        };
    };

    return { datas, selectData, dataToOption };
};
