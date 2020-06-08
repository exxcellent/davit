import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { selectComponents } from "../../../../../../../slices/ComponentSlice";
import { selectDatas, selectRelations } from "../../../../../../../slices/DataSlice";
import { currentSequence, selectSequences } from "../../../../../../../slices/SequenceSlice";

interface Carv2DropdownProps extends DropdownProps {}

export const Carv2Dropdown: FunctionComponent<Carv2DropdownProps> = (props) => {
  return <Dropdown {...props.other} />;
};

export const useGetComponentDropdown = (onSelect: (component: ComponentCTO | undefined) => void, icon?: string) => {
  const components: ComponentCTO[] = useSelector(selectComponents);

  const componentToOption = (component: ComponentCTO): DropdownItemProps => {
    return {
      key: component.component.id,
      value: component.component.id,
      text: component.component.name,
    };
  };

  const selectComponent = (id: number) => {
    onSelect(components.find((component) => component.component.id === id));
  };

  return (
    <Dropdown
      options={components.map(componentToOption)}
      icon={icon}
      onChange={(event, data) => selectComponent(Number(data.value))}
      className="button icon"
      floating
      trigger={<React.Fragment />}
    />
  );
};

export const useGetStepDropDown = (onSelect: (step: SequenceStepCTO | undefined) => void, icon?: string) => {
  const sequence: SequenceCTO | null = useSelector(currentSequence);

  const stepOptions = (): DropdownItemProps[] => {
    if (!isNullOrUndefined(sequence)) {
      return sequence.sequenceStepCTOs.map(stepToOption);
    }
    return [];
  };

  const stepToOption = (step: SequenceStepCTO): DropdownItemProps => {
    return {
      key: step.squenceStepTO.id,
      value: step.squenceStepTO.id,
      text: step.squenceStepTO.name,
    };
  };

  const selectStep = (id: number) => {
    if (!isNullOrUndefined(sequence)) {
      onSelect(sequence.sequenceStepCTOs.find((step) => step.squenceStepTO.id === id));
    }
  };

  return (
    <Dropdown
      options={stepOptions()}
      icon={icon}
      onChange={(event, data) => selectStep(Number(data.value))}
      className="button icon"
      floating
      trigger={<React.Fragment />}
    />
  );
};

export const useGetComponentDropdownLable = (
  onSelect: (component: ComponentCTO | undefined) => void,
  placeholder?: string
) => {
  const components: ComponentCTO[] = useSelector(selectComponents);

  const componentToOption = (component: ComponentCTO): DropdownItemProps => {
    return {
      key: component.component.id,
      value: component.component.id,
      text: component.component.name,
    };
  };

  const selectComponent = (id: number) => {
    onSelect(components.find((component) => component.component.id === id));
  };

  return (
    <Dropdown
      options={components.map(componentToOption)}
      selection
      placeholder={placeholder}
      onChange={(event, data) => selectComponent(Number(data.value))}
    />
  );
};

export const useGetMultiSelectDataDropdown = (onSelect: (datas: DataCTO[]) => void, selected: number[]) => {
  const datas: DataCTO[] = useSelector(selectDatas);

  const dataToOption = (data: DataCTO): DropdownItemProps => {
    return {
      key: data.data.id,
      value: data.data.id,
      text: data.data.name,
    };
  };

  const selectData = (dataIds: number[]) => {
    let dataToReturn: DataCTO[] = [];
    if (dataIds !== undefined) {
      dataIds.map((id) => dataToReturn.push(datas.find((data) => data.data.id === id)!));
      onSelect(dataToReturn);
    } else {
      onSelect([]);
    }
  };

  return (
    <Dropdown
      placeholder="Select Data"
      fluid
      multiple
      search
      selection
      options={datas.map(dataToOption)}
      onChange={(event, data) => {
        selectData((data.value as number[]) || undefined);
      }}
      value={selected}
      // renderLabel={dataLabel}
    />
  );
};

export const useGetDataDropdown = (onSelect: (data: DataCTO | undefined) => void, icon?: string) => {
  const datas: DataCTO[] = useSelector(selectDatas);

  const dataToOption = (data: DataCTO): DropdownItemProps => {
    return {
      key: data.data.id,
      value: data.data.id,
      text: data.data.name,
    };
  };

  const selectData = (id: number) => {
    onSelect(datas.find((data) => data.data.id === id));
  };

  return (
    <Dropdown
      options={datas.map(dataToOption)}
      icon={icon}
      // placeholder="Select Data"
      // selection
      onChange={(event, data) => selectData(Number(data.value))}
      // labeled
      className="button icon"
      inverted="true"
      color="orange"
      floating
      // button
      trigger={<React.Fragment />}
    />
  );
};

export const useGetSequenceDropdown = (onSelect: (sequence: SequenceCTO | undefined) => void, icon?: string) => {
  const sequences: SequenceCTO[] = useSelector(selectSequences);

  const sequenceToOption = (sequence: SequenceCTO): DropdownItemProps => {
    return {
      key: sequence.sequenceTO.id,
      value: sequence.sequenceTO.id,
      text: sequence.sequenceTO.name,
    };
  };

  const selectSequence = (id: number) => {
    onSelect(sequences.find((sequence) => sequence.sequenceTO.id === id));
  };

  return (
    <Dropdown
      options={sequences.map(sequenceToOption)}
      icon={icon}
      // placeholder="Select Data"
      // selection
      onChange={(event, sequence) => selectSequence(Number(sequence.value))}
      // labeled
      className="button icon"
      inverted="true"
      color="orange"
      floating
      // button
      trigger={<React.Fragment />}
    />
  );
};

export const useGetRelationDropdown = (onSelect: (relation: DataRelationCTO | undefined) => void, icon?: string) => {
  const relations: DataRelationCTO[] = useSelector(selectRelations);

  const relationToOption = (relation: DataRelationCTO): DropdownItemProps => {
    const text: string = relation.dataCTO1.data.name + " - " + relation.dataCTO2.data.name;
    return {
      key: relation.dataRelationTO.id,
      value: relation.dataRelationTO.id,
      text: text,
    };
  };

  const selectDataRelation = (id: number) => {
    onSelect(relations.find((relation) => relation.dataRelationTO.id === id));
  };

  return (
    <Dropdown
      options={relations.map(relationToOption)}
      icon={icon}
      // placeholder="Select Data"
      // selection
      onChange={(event, data) => selectDataRelation(Number(data.value))}
      // labeled
      className="button icon"
      inverted="true"
      color="orange"
      floating
      // button
      trigger={<React.Fragment />}
    />
  );
};
