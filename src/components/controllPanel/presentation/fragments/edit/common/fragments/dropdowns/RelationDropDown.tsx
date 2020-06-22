import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataRelationCTO } from "../../../../../../../../dataAccess/access/cto/DataRelationCTO";
import { selectRelations } from "../../../../../../../../slices/DataSlice";

interface RelationDropDownProps extends DropdownProps {
  onSelect: (relation: DataRelationCTO | undefined) => void;
  placeholder?: string;
  icon?: string;
}

export const RelationDropDown: FunctionComponent<RelationDropDownProps> = (props) => {
  const { onSelect, placeholder, icon } = props;
  const { relations, selectDataRelation, relationToOption } = useRelationDropDownViewModel();

  return (
    <>
      {placeholder && (
        <Dropdown
          options={relations.map(relationToOption)}
          placeholder={placeholder}
          onChange={(event, data) => onSelect(selectDataRelation(Number(data.value), relations))}
          selectOnBlur={false}
          scrolling
          selection
        />
      )}
      {icon && (
        <Dropdown
          options={relations.map(relationToOption)}
          icon={icon}
          onChange={(event, data) => onSelect(selectDataRelation(Number(data.value), relations))}
          className="button icon"
          inverted="true"
          color="orange"
          floating
          selectOnBlur={false}
          trigger={<React.Fragment />}
          scrolling
        />
      )}
    </>
  );
};

const useRelationDropDownViewModel = () => {
  const relations: DataRelationCTO[] = useSelector(selectRelations);

  const selectDataRelation = (relationId: number, relations: DataRelationCTO[]): DataRelationCTO | undefined => {
    if (!isNullOrUndefined(relationId) && !isNullOrUndefined(relations)) {
      return relations.find((relation) => relation.dataRelationTO.id === relationId);
    }
    return undefined;
  };

  const relationToOption = (relation: DataRelationCTO): DropdownItemProps => {
    const text: string = relation.dataCTO1.data.name + " - " + relation.dataCTO2.data.name;
    return {
      key: relation.dataRelationTO.id,
      value: relation.dataRelationTO.id,
      text: text,
    };
  };

  return { relations, selectDataRelation, relationToOption };
};
