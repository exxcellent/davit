import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataSetupCTO } from "../../../../dataAccess/access/cto/DataSetupCTO";
import { selectDataSetups } from "../../../../slices/SequenceSlice";

interface DataSetupDropDownProps extends DropdownProps {
  onSelect: (dataSetup: DataSetupCTO | undefined) => void;
  placeholder?: string;
  icon?: string;
}

export const DataSetupDropDown: FunctionComponent<DataSetupDropDownProps> = (props) => {
  const { onSelect, placeholder, icon } = props;
  const { dataSetups, selectDataSetup, dataSetupToOption } = useDataSetupDropDownViewModel();

  return (
    <>
      {placeholder && (
        <Dropdown
          options={dataSetups.map(dataSetupToOption).sort((a, b) => {
            return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
          })}
          selection
          selectOnBlur={false}
          placeholder={placeholder}
          onChange={(event, data) => onSelect(selectDataSetup(Number(data.value), dataSetups))}
          scrolling
        />
      )}
      {icon && (
        <Dropdown
          options={dataSetups.map(dataSetupToOption).sort((a, b) => {
            return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
          })}
          icon={icon}
          selectOnBlur={false}
          onChange={(event, data) => onSelect(selectDataSetup(Number(data.value), dataSetups))}
          className="button icon"
          trigger={<React.Fragment />}
          scrolling
        />
      )}
    </>
  );
};

const useDataSetupDropDownViewModel = () => {
  const dataSetups: DataSetupCTO[] = useSelector(selectDataSetups);

  const dataSetupToOption = (dataSetup: DataSetupCTO): DropdownItemProps => {
    return {
      key: dataSetup.dataSetup.id,
      value: dataSetup.dataSetup.id,
      text: dataSetup.dataSetup.name,
    };
  };

  const selectDataSetup = (dataSetupId: number, dataSetups: DataSetupCTO[]): DataSetupCTO | undefined => {
    if (!isNullOrUndefined(dataSetups) && !isNullOrUndefined(dataSetupId)) {
      return dataSetups.find((dataSetup) => dataSetup.dataSetup.id === dataSetupId);
    }
    return undefined;
  };

  return { dataSetups, dataSetupToOption, selectDataSetup };
};
