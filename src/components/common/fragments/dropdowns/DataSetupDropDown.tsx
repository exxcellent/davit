import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { DropdownProps } from 'semantic-ui-react';
import { DataSetupTO } from '../../../../dataAccess/access/to/DataSetupTO';
import { masterDataSelectors } from '../../../../slices/MasterDataSlice';
import { DavitUtil } from '../../../../utils/DavitUtil';
import { DavitDropDown, DavitDropDownItemProps, DavitIconDropDown } from './DavitDropDown';

interface DataSetupDropDownProps extends DropdownProps {
    onSelect: (dataSetup: DataSetupTO | undefined) => void;
    placeholder?: string;
    value?: number;
}

interface DataSetupDropDownPropsButton extends DropdownProps {
    onSelect: (dataSetup: DataSetupTO | undefined) => void;
    icon?: string;
}

export const DataSetupDropDown: FunctionComponent<DataSetupDropDownProps> = (props) => {
    const { onSelect, placeholder, value } = props;
    const { dataSetups, selectDataSetup, dataSetupToOption } = useDataSetupDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={dataSetups.map(dataSetupToOption)}
            value={value?.toString()}
            clearable={true}
            onSelect={(setup) => onSelect(selectDataSetup(Number(setup.value), dataSetups))}
            placeholder={placeholder}
        />
    );
};

export const DataSetupDropDownButton: FunctionComponent<DataSetupDropDownPropsButton> = (props) => {
    const { onSelect, icon } = props;
    const { dataSetups, selectDataSetup, dataSetupToOption } = useDataSetupDropDownViewModel();

    return (
        <DavitIconDropDown
            dropdownItems={dataSetups.map(dataSetupToOption)}
            icon={icon}
            onSelect={(setup) => onSelect(selectDataSetup(Number(setup.value), dataSetups))}
        />
    );
};

const useDataSetupDropDownViewModel = () => {
    const dataSetups: DataSetupTO[] = useSelector(masterDataSelectors.dataSetup);

    const dataSetupToOption = (dataSetup: DataSetupTO): DavitDropDownItemProps => {
        return {
            key: dataSetup.id,
            value: dataSetup.id.toString(),
            text: dataSetup.name,
        };
    };

    const selectDataSetup = (dataSetupId: number, dataSetups: DataSetupTO[]): DataSetupTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(dataSetups) && !DavitUtil.isNullOrUndefined(dataSetupId)) {
            return dataSetups.find((dataSetup) => dataSetup.id === dataSetupId);
        }
        return undefined;
    };

    return { dataSetups, dataSetupToOption, selectDataSetup };
};
