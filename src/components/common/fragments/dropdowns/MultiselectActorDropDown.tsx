import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {Dropdown, DropdownItemProps, DropdownProps} from 'semantic-ui-react';

import {ActorCTO} from '../../../../dataAccess/access/cto/ActorCTO';
import {masterDataSelectors} from '../../../../slices/MasterDataSlice';

interface MultiselectActorDropDownProps extends DropdownProps {
  onSelect: (dataIds: number[] | undefined) => void;
  selected: number[];
  placeholder?: string;
}

export const MultiselectActorDropDown: FunctionComponent<MultiselectActorDropDownProps> = (props) => {
  const {onSelect, selected, placeholder} = props;
  const {actors, actorToOption} = useMultiselectActorDropDownViewModel();

  return (
    <Dropdown
      placeholder={placeholder || 'Select Actors ...'}
      fluid
      multiple
      selection
      options={([] as DropdownItemProps[]).concat.apply([], actors.map(actorToOption)).sort(function(a, b) {
        return ('' + a.attr).localeCompare(b.attr);
      })}
      onChange={(event, data) => {
        onSelect((data.value as number[]) || undefined);
      }}
      value={selected}
      scrolling
      disabled={actors.length > 0 ? false : true}
      style={{overflow: 'auto'}}
    />
  );
};

const useMultiselectActorDropDownViewModel = () => {
  const actors: ActorCTO[] = useSelector(masterDataSelectors.actors);

  const actorToOption = (actor: ActorCTO): DropdownItemProps[] => {
    return [
      {
        key: actor.actor.id,
        value: actor.actor.id,
        text: actor.actor.name,
      },
    ];
  };

  return {actors, actorToOption};
};
