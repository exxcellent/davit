import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ActionCTO } from "../../../../../../../dataAccess/access/cto/ActionCTO";
import { ComponentCTO } from "../../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { GroupTO } from "../../../../../../../dataAccess/access/to/GroupTO";
import { selectComponents, selectGroups } from "../../../../../../../slices/ComponentSlice";
import { selectDatas, selectRelations } from "../../../../../../../slices/DataSlice";
import { currentActions, currentSequence, selectSequences } from "../../../../../../../slices/SequenceSlice";

interface Carv2DropdownProps extends DropdownProps {}

export const Carv2Dropdown: FunctionComponent<Carv2DropdownProps> = (props) => {
  return <Dropdown {...props.other} />;
};

// ----- Data to Options -----

const componentToOption = (component: ComponentCTO): DropdownItemProps => {
  return {
    key: component.component.id,
    value: component.component.id,
    text: component.component.name,
  };
};

const colorToOption = (color: string): DropdownItemProps => {
  return {
    key: color,
    value: color,
    text: color,
  };
};

const groupToOption = (group: GroupTO): DropdownItemProps => {
  return {
    key: group.id,
    value: group.id,
    text: group.name,
  };
};

const stepToOption = (step: SequenceStepCTO): DropdownItemProps => {
  return {
    key: step.squenceStepTO.id,
    value: step.squenceStepTO.id,
    text: step.squenceStepTO.index,
  };
};

const stepOptions = (sequence: SequenceCTO | null): DropdownItemProps[] => {
  if (!isNullOrUndefined(sequence)) {
    return sequence.sequenceStepCTOs.map(stepToOption);
  }
  return [];
};

const dataToOption = (data: DataCTO): DropdownItemProps => {
  return {
    key: data.data.id,
    value: data.data.id,
    text: data.data.name,
  };
};

const sequenceToOption = (sequence: SequenceCTO): DropdownItemProps => {
  return {
    key: sequence.sequenceTO.id,
    value: sequence.sequenceTO.id,
    text: sequence.sequenceTO.name,
  };
};

const relationToOption = (relation: DataRelationCTO): DropdownItemProps => {
  const text: string = relation.dataCTO1.data.name + " - " + relation.dataCTO2.data.name;
  return {
    key: relation.dataRelationTO.id,
    value: relation.dataRelationTO.id,
    text: text,
  };
};

const actionToOption = (action: ActionCTO): DropdownItemProps => {
  const text: string = `${action.componentTO.name} - ${action.actionTO.actionType} - ${action.dataTO.name}`;
  return {
    key: action.actionTO.id,
    value: action.actionTO.id,
    text: text,
  };
};

// ----- On Select Methods -----

const selectComponent = (componentId: number, components: ComponentCTO[]): ComponentCTO | undefined => {
  if (!isNullOrUndefined(components) && !isNullOrUndefined(componentId)) {
    return components.find((component) => component.component.id === componentId);
  }
  return undefined;
};

const selectGroup = (groupId: number, groups: GroupTO[]): GroupTO | undefined => {
  if (!isNullOrUndefined(groups) && !isNullOrUndefined(groupId)) {
    return groups.find((group) => group.id === groupId);
  }
  return undefined;
};

const selectSequenceStep = (stepId: number, sequence: SequenceCTO | null): SequenceStepCTO | undefined => {
  if (!isNullOrUndefined(sequence) && !isNullOrUndefined(stepId)) {
    return sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === stepId);
  }
  return undefined;
};

const selectDataOptions = (dataIds: number[] | undefined, datas: DataCTO[]): DataCTO[] => {
  let dataToReturn: DataCTO[] = [];
  if (dataIds !== undefined && !isNullOrUndefined(datas)) {
    dataIds.map((id) => dataToReturn.push(datas.find((data) => data.data.id === id)!));
  }
  return dataToReturn;
};

const selectData = (dataId: number, datas: DataCTO[]): DataCTO | undefined => {
  if (!isNullOrUndefined(dataId) && !isNullOrUndefined(datas)) {
    return datas.find((data) => data.data.id === dataId);
  }
  return undefined;
};

const selectSequence = (sequenceId: number, sequences: SequenceCTO[]): SequenceCTO | undefined => {
  if (!isNullOrUndefined(sequenceId) && !isNullOrUndefined(sequences)) {
    return sequences.find((sequence) => sequence.sequenceTO.id === sequenceId);
  }
  return undefined;
};

const selectDataRelation = (relationId: number, relations: DataRelationCTO[]): DataRelationCTO | undefined => {
  if (!isNullOrUndefined(relationId) && !isNullOrUndefined(relations)) {
    return relations.find((relation) => relation.dataRelationTO.id === relationId);
  }
  return undefined;
};

const selectAction = (actionId: number, actions: ActionCTO[]): ActionCTO | undefined => {
  if (!isNullOrUndefined(actionId) && !isNullOrUndefined(actions)) {
    return actions.find((action) => action.actionTO.id === actionId);
  }
  return undefined;
};

// ------ Dropdowns ------

export const useGetActionDropDown = (onSelect: (action: ActionCTO | undefined) => void, icon: string) => {
  const actions: ActionCTO[] = useSelector(currentActions);
  return (
    <Dropdown
      options={actions.map(actionToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectAction(Number(data.value), actions))}
      scrolling
      floating
      compact
      className="button icon"
      icon={icon}
    />
  );
};

export const colorDropDown = (onSelect: (color: string | undefined) => void, value: string) => {
  const colors: string[] = ["red", "blue", "green"];
  return (
    <Dropdown
      options={colors.map(colorToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      onChange={(event, data) => onSelect(data.value as string)}
      scrolling
      value={value}
      floating
      compact
    />
  );
};

export const useGetComponentDropdown = (onSelect: (component: ComponentCTO | undefined) => void, icon?: string) => {
  const components: ComponentCTO[] = useSelector(selectComponents);
  return (
    <Dropdown
      options={components.map(componentToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      icon={icon}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectComponent(Number(data.value), components))}
      className="button icon"
      trigger={<React.Fragment />}
      scrolling
    />
  );
};

export const useGetGroupDropdown = (onSelect: (group: GroupTO | undefined) => void, icon?: string) => {
  const groups: GroupTO[] = useSelector(selectGroups);
  return (
    <Dropdown
      options={groups.map(groupToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      icon={icon}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectGroup(Number(data.value), groups))}
      className="button icon"
      floating
      trigger={<React.Fragment />}
      scrolling
    />
  );
};

export const useGetGroupDropdownLabel = (
  onSelect: (group: GroupTO | undefined) => void,
  placeholder?: string,
  value?: number
) => {
  const groups: GroupTO[] = useSelector(selectGroups);
  return (
    <Dropdown
      options={groups.map(groupToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      placeholder={placeholder}
      onChange={(event, data) => onSelect(selectGroup(Number(data.value), groups))}
      scrolling
      clearable
      value={value}
    />
  );
};

export const useGetStepDropDown = (
  onSelect: (step: SequenceStepCTO | undefined) => void,
  icon?: string
): JSX.Element => {
  const sequence: SequenceCTO | null = useSelector(currentSequence);
  return (
    <Dropdown
      options={stepOptions(sequence)}
      icon={icon}
      onChange={(event, data) => onSelect(selectSequenceStep(Number(data.value), sequence))}
      className="button icon"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
    />
  );
};

export const useGetComponentDropdownLabel = (
  onSelect: (component: ComponentCTO | undefined) => void,
  placeholder?: string
) => {
  const components: ComponentCTO[] = useSelector(selectComponents);
  return (
    <Dropdown
      options={components.map(componentToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      placeholder={placeholder}
      onChange={(event, data) => onSelect(selectComponent(Number(data.value), components))}
      scrolling
    />
  );
};

export const useGetMultiSelectDataDropdown = (onSelect: (datas: DataCTO[]) => void, selected: number[]) => {
  const datas: DataCTO[] = useSelector(selectDatas);
  return (
    <Dropdown
      placeholder="Select Data"
      fluid
      multiple
      search
      selection
      selectOnBlur={false}
      options={datas.map(dataToOption)}
      onChange={(event, data) => {
        onSelect(selectDataOptions((data.value as number[]) || undefined, datas));
      }}
      value={selected}
      scrolling
    />
  );
};

export const useGetDataDropdown = (onSelect: (data: DataCTO | undefined) => void, icon?: string) => {
  const datas: DataCTO[] = useSelector(selectDatas);
  return (
    <Dropdown
      options={datas.map(dataToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      icon={icon}
      onChange={(event, data) => onSelect(selectData(Number(data.value), datas))}
      className="button icon"
      inverted="true"
      color="orange"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
    />
  );
};

export const useGetSequenceDropdown = (onSelect: (sequence: SequenceCTO | undefined) => void, icon?: string) => {
  const sequences: SequenceCTO[] = useSelector(selectSequences);
  return (
    <Dropdown
      options={sequences.map(sequenceToOption)}
      icon={icon}
      onChange={(event, sequence) => onSelect(selectSequence(Number(sequence.value), sequences))}
      className="button icon"
      inverted="true"
      color="orange"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
    />
  );
};

export const useGetSequenceLabelDropdown = (
  onSelect: (sequence: SequenceCTO | undefined) => void,
  placeholder?: string
) => {
  const sequences: SequenceCTO[] = useSelector(selectSequences);
  return (
    <Dropdown
      options={sequences.map(sequenceToOption)}
      selection
      clearable
      selectOnBlur={false}
      placeholder={placeholder}
      onChange={(event, data) => onSelect(selectSequence(Number(data.value), sequences))}
      scrolling
    />
  );
};

export const useGetRelationDropdown = (onSelect: (relation: DataRelationCTO | undefined) => void, icon?: string) => {
  const relations: DataRelationCTO[] = useSelector(selectRelations);
  return (
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
  );
};
