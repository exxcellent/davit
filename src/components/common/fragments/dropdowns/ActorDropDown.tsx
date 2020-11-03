import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {Dropdown, DropdownItemProps, DropdownProps} from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';

import {ActorCTO} from '../../../../dataAccess/access/cto/ActorCTO';
import {masterDataSelectors} from '../../../../slices/MasterDataSlice';

interface ActorDropDownProps extends DropdownProps {
  onSelect: (actor: ActorCTO | undefined) => void;
  placeholder?: string;
  value?: number;
}

interface ActorDropDownButtonProps extends DropdownProps {
  onSelect: (actor: ActorCTO | undefined) => void;
  icon?: string;
}

export const ActorDropDown: FunctionComponent<ActorDropDownProps> = (props) => {
  const {onSelect, placeholder, value} = props;
  const {actors, actorToOption, selectActor} = useActorDropDownViewModel();

  return (
    <Dropdown
      options={actors.map(actorToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selection
      selectOnBlur={false}
      placeholder={placeholder || 'Select Actor ...'}
      onChange={(event, data) => onSelect(selectActor(Number(data.value), actors))}
      scrolling
      value={value === -1 ? undefined : value}
      disabled={actors.length > 0 ? false : true}
    />
  );
};

export const ActorDropDownButton: FunctionComponent<ActorDropDownButtonProps> = (props) => {
  const {onSelect, icon} = props;
  const {actorToOption, actors, selectActor} = useActorDropDownViewModel();

  return (
    <Dropdown
      options={actors.map(actorToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      icon={actors.length > 0 ? icon : ''}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectActor(Number(data.value), actors))}
      className="button icon"
      trigger={<React.Fragment />}
      scrolling
      disabled={actors.length > 0 ? false : true}
    />
  );
};

const useActorDropDownViewModel = () => {
  const actors: ActorCTO[] = useSelector(masterDataSelectors.actors);

  const actorToOption = (actor: ActorCTO): DropdownItemProps => {
    return {
      key: actor.actor.id,
      value: actor.actor.id,
      text: actor.actor.name,
    };
  };

  const selectActor = (actorId: number, actors: ActorCTO[]): ActorCTO | undefined => {
    if (!isNullOrUndefined(actors) && !isNullOrUndefined(actorId)) {
      return actors.find((actor) => actor.actor.id === actorId);
    }
    return undefined;
  };

  return {actors, actorToOption, selectActor};
};
