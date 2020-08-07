import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { InitDataTO } from "../../../../dataAccess/access/to/InitDataTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface InitDataDropDownDownProps extends DropdownProps {
  initDatas: InitDataTO[];
  onSelect: (initData: InitDataTO | undefined) => void;
  placeholder?: string;
  value?: number;
}

interface InitDataDropDownPropsButton extends DropdownProps {
  initDatas: InitDataTO[];
  onSelect: (initData: InitDataTO | undefined) => void;
  icon?: string;
}

export const InitDataDropDown: FunctionComponent<InitDataDropDownDownProps> = (props) => {
  const { onSelect, placeholder, value, initDatas } = props;
  const { initDataToOption, selectInitData } = useDataSetupDropDownViewModel();

  return (
    <Dropdown
      options={initDatas.map(initDataToOption).sort(function (a, b) {
        return ("" + a.attr).localeCompare(b.attr);
      })}
      selection
      selectOnBlur={false}
      placeholder={placeholder || "Select Data ..."}
      onChange={(event, data) => onSelect(selectInitData(Number(data.value), initDatas))}
      scrolling
      clearable={true}
      value={value}
    />
  );
};

export const InitDataDropDownButton: FunctionComponent<InitDataDropDownPropsButton> = (props) => {
  const { onSelect, icon, initDatas } = props;
  const { initDataToOption, selectInitData } = useDataSetupDropDownViewModel();

  return (
    <Dropdown
      options={initDatas.map(initDataToOption).sort(function (a, b) {
        return ("" + a.attr).localeCompare(b.attr);
      })}
      icon={icon}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectInitData(Number(data.value), initDatas))}
      className="button icon"
      trigger={<React.Fragment />}
      scrolling
    />
  );
};

const useDataSetupDropDownViewModel = () => {
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

  const getComponentName = (compId: number): string => {
    return components.find((comp) => comp.component.id === compId)?.component.name || "";
  };

  const getDataName = (id: number): string => {
    return datas.find((data) => data.data.id === id)?.data.name || "";
  };

  const initDataToOption = (initData: InitDataTO): DropdownItemProps => {
    return {
      key: initData.id,
      value: initData.id,
      text: getComponentName(initData.componentFk) + " - " + getDataName(initData.dataFk),
    };
  };

  const selectInitData = (initDataId: number, initDatas: InitDataTO[]): InitDataTO | undefined => {
    if (!isNullOrUndefined(initDataId) && !isNullOrUndefined(initDatas)) {
      return initDatas.find((initData) => initData.id === initDataId);
    }
    return undefined;
  };

  return { initDataToOption, selectInitData };
};
