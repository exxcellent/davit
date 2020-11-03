import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {Dropdown, DropdownItemProps, DropdownProps} from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';

import {ActorCTO} from '../../../../dataAccess/access/cto/ActorCTO';
import {DataCTO} from '../../../../dataAccess/access/cto/DataCTO';
import {InitDataTO} from '../../../../dataAccess/access/to/InitDataTO';
import {masterDataSelectors} from '../../../../slices/MasterDataSlice';

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
  const {onSelect, placeholder, value, initDatas} = props;
  const {initDataToOption, selectInitData} = useDataSetupDropDownViewModel();

  return (
    <Dropdown
      options={initDatas.map(initDataToOption).sort(function(a, b) {
        return ('' + a.attr).localeCompare(b.attr);
      })}
      selection
      selectOnBlur={false}
      placeholder={placeholder || 'Select Data ...'}
      onChange={(event, data) => onSelect(selectInitData(Number(data.value), initDatas))}
      scrolling
      clearable={true}
      value={value}
      disabled={initDatas.length > 0 ? false : true}
    />
  );
};

export const InitDataDropDownButton: FunctionComponent<InitDataDropDownPropsButton> = (props) => {
  const {onSelect, icon, initDatas} = props;
  const {initDataToOption, selectInitData} = useDataSetupDropDownViewModel();

  return (
    <Dropdown
      options={initDatas.map(initDataToOption).sort(function(a, b) {
        return ('' + a.attr).localeCompare(b.attr);
      })}
      icon={initDatas.length > 0 ? icon : ''}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectInitData(Number(data.value), initDatas))}
      className="button icon"
      trigger={<React.Fragment />}
      scrolling
      disabled={initDatas.length > 0 ? false : true}
    />
  );
};

const useDataSetupDropDownViewModel = () => {
  const actors: ActorCTO[] = useSelector(masterDataSelectors.actors);
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

  const getActorName = (actorId: number): string => {
    return actors.find((actor) => actor.actor.id === actorId)?.actor.name || '';
  };

  const getDataName = (dataId: number, instanceId?: number): string => {
    let dataName: string = '';
    let instanceName: string = '';
    const data: DataCTO | undefined = datas.find((data) => data.data.id === dataId);
    dataName = data?.data.name || '';
    if (data && instanceId && instanceId > 1) {
      instanceName = data.data.instances.find((inst) => inst.id === instanceId)?.name || '';
      dataName = dataName + ' - ' + instanceName;
    }
    return dataName;
  };

  const initDataToOption = (initData: InitDataTO): DropdownItemProps => {
    return {
      key: initData.id,
      value: initData.id,
      text: getActorName(initData.actorFk) + ' + ' + getDataName(initData.dataFk, initData.instanceFk),
    };
  };

  const selectInitData = (initDataId: number, initDatas: InitDataTO[]): InitDataTO | undefined => {
    if (!isNullOrUndefined(initDataId) && !isNullOrUndefined(initDatas)) {
      return initDatas.find((initData) => initData.id === initDataId);
    }
    return undefined;
  };

  return {initDataToOption, selectInitData};
};
