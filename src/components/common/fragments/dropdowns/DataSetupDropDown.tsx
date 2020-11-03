import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {Dropdown, DropdownItemProps, DropdownProps} from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';
import {DataSetupTO} from '../../../../dataAccess/access/to/DataSetupTO';
import {masterDataSelectors} from '../../../../slices/MasterDataSlice';

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
  const {onSelect, placeholder, value} = props;
  const {dataSetups, selectDataSetup, dataSetupToOption} = useDataSetupDropDownViewModel();

  return (
    <Dropdown
      options={dataSetups.map(dataSetupToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      placeholder={placeholder || 'Select Data ...'}
      onChange={(event, data) => onSelect(selectDataSetup(Number(data.value), dataSetups))}
      scrolling
      clearable={true}
      value={value}
      disabled={dataSetups.length > 0 ? false : true}
    />
  );
};

export const DataSetupDropDownButton: FunctionComponent<DataSetupDropDownPropsButton> = (props) => {
  const {onSelect, icon} = props;
  const {dataSetups, selectDataSetup, dataSetupToOption} = useDataSetupDropDownViewModel();

  return (
    <Dropdown
      options={dataSetups.map(dataSetupToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      icon={dataSetups.length > 0 ? icon : ''}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectDataSetup(Number(data.value), dataSetups))}
      className="button icon"
      trigger={<React.Fragment />}
      scrolling
      disabled={dataSetups.length > 0 ? false : true}
    />
  );
};

const useDataSetupDropDownViewModel = () => {
  const dataSetups: DataSetupTO[] = useSelector(masterDataSelectors.dataSetup);

  const dataSetupToOption = (dataSetup: DataSetupTO): DropdownItemProps => {
    return {
      key: dataSetup.id,
      value: dataSetup.id,
      text: dataSetup.name,
    };
  };

  const selectDataSetup = (dataSetupId: number, dataSetups: DataSetupTO[]): DataSetupTO | undefined => {
    if (!isNullOrUndefined(dataSetups) && !isNullOrUndefined(dataSetupId)) {
      return dataSetups.find((dataSetup) => dataSetup.id === dataSetupId);
    }
    return undefined;
  };

  return {dataSetups, dataSetupToOption, selectDataSetup};
};
