import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {DropdownProps} from 'semantic-ui-react';
import {DataCTO} from '../../../../dataAccess/access/cto/DataCTO';
import {DataRelationTO} from '../../../../dataAccess/access/to/DataRelationTO';
import {masterDataSelectors} from '../../../../slices/MasterDataSlice';
import {DavitUtil} from '../../../../utils/DavitUtil';
import {DavitDropDown, DavitDropDownItemProps, DavitIconDropDown} from './DavitDropDown';

interface RelationDropDownProps extends DropdownProps {
  onSelect: (relation: DataRelationTO | undefined) => void;
  placeholder?: string;
}

interface RelationDropDownPropsButton extends DropdownProps {
  onSelect: (relation: DataRelationTO | undefined) => void;
  icon?: string;
}

export const RelationDropDown: FunctionComponent<RelationDropDownProps> = (props) => {
  const {onSelect, placeholder} = props;
  const {relations, selectDataRelation, relationToOption} = useRelationDropDownViewModel();

  return (
    <DavitDropDown
      dropdownItems={relations.map(relationToOption)}
      placeholder={placeholder}
      onSelect={(relation) => onSelect(selectDataRelation(Number(relation.value), relations))}
    />
  );
};

export const RelationDropDownButton: FunctionComponent<RelationDropDownPropsButton> = (props) => {
  const {onSelect, icon} = props;
  const {relations, selectDataRelation, relationToOption} = useRelationDropDownViewModel();

  return (
    <DavitIconDropDown
      dropdownItems={relations.map(relationToOption)}
      icon={icon}
      onSelect={(relation) => onSelect(selectDataRelation(Number(relation.value), relations))}
    />
  );
};

const useRelationDropDownViewModel = () => {
  const relations: DataRelationTO[] = useSelector(masterDataSelectors.relations);
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

  const getDataName = (dataId: number, datas: DataCTO[]): string => {
    return datas.find((data) => data.data.id === dataId)?.data.name || '';
  };

  const selectDataRelation = (relationId: number, relations: DataRelationTO[]): DataRelationTO | undefined => {
    if (!DavitUtil.isNullOrUndefined(relationId) && !DavitUtil.isNullOrUndefined(relations)) {
      return relations.find((relation) => relation.id === relationId);
    }
    return undefined;
  };

  const relationToOption = (relation: DataRelationTO): DavitDropDownItemProps => {
    const text: string = getDataName(relation.data1Fk, datas) + ' - ' + getDataName(relation.data2Fk, datas);
    return {
      key: relation.id,
      value: relation.id.toString(),
      text: text,
    };
  };

  return {relations, selectDataRelation, relationToOption};
};
