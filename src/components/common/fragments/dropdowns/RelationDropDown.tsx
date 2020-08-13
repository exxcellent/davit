import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { DataRelationTO } from "../../../../dataAccess/access/to/DataRelationTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface RelationDropDownProps extends DropdownProps {
  onSelect: (relation: DataRelationTO | undefined) => void;
  placeholder?: string;
}

interface RelationDropDownPropsButton extends DropdownProps {
  onSelect: (relation: DataRelationTO | undefined) => void;
  icon?: string;
}

export const RelationDropDown: FunctionComponent<RelationDropDownProps> = (props) => {
  const { onSelect, placeholder } = props;
  const { relations, selectDataRelation, relationToOption } = useRelationDropDownViewModel();

  return (
    <Dropdown
      options={relations.map(relationToOption)}
      placeholder={placeholder}
      onChange={(event, data) => onSelect(selectDataRelation(Number(data.value), relations))}
      selectOnBlur={false}
      scrolling
      selection
      disabled={relations.length > 0 ? false : true}
    />
  );
};

export const RelationDropDownButton: FunctionComponent<RelationDropDownPropsButton> = (props) => {
  const { onSelect, icon } = props;
  const { relations, selectDataRelation, relationToOption } = useRelationDropDownViewModel();

  return (
    <Dropdown
      options={relations.map(relationToOption)}
      icon={relations.length > 0 ? icon : ""}
      onChange={(event, data) => onSelect(selectDataRelation(Number(data.value), relations))}
      className="button icon"
      inverted="true"
      color="orange"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={relations.length > 0 ? false : true}
    />
  );
};

const useRelationDropDownViewModel = () => {
  const relations: DataRelationTO[] = useSelector(masterDataSelectors.relations);
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);

  const getDataName = (dataId: number, datas: DataCTO[]): string => {
    return datas.find((data) => data.data.id === dataId)?.data.name || "";
  };

  const selectDataRelation = (relationId: number, relations: DataRelationTO[]): DataRelationTO | undefined => {
    if (!isNullOrUndefined(relationId) && !isNullOrUndefined(relations)) {
      return relations.find((relation) => relation.id === relationId);
    }
    return undefined;
  };

  const relationToOption = (relation: DataRelationTO): DropdownItemProps => {
    const text: string = getDataName(relation.data1Fk, datas) + " - " + getDataName(relation.data2Fk, datas);
    return {
      key: relation.id,
      value: relation.id,
      text: text,
    };
  };

  return { relations, selectDataRelation, relationToOption };
};
