import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { DropdownProps } from 'semantic-ui-react';
import { ActorCTO } from '../../../../dataAccess/access/cto/ActorCTO';
import { masterDataSelectors } from '../../../../slices/MasterDataSlice';
import { DavitUtil } from '../../../../utils/DavitUtil';
import { DavitDropDown, DavitDropDownItemProps, DavitIconDropDown } from './DavitDropDown';

interface ActorDropDownProps extends DropdownProps {
    onSelect: (actor: ActorCTO | undefined) => void;
    placeholder?: string;
    value?: string;
}

interface ActorDropDownButtonProps extends DropdownProps {
    onSelect: (actor: ActorCTO | undefined) => void;
    icon?: string;
}

export const ActorDropDown: FunctionComponent<ActorDropDownProps> = (props) => {
    const { onSelect, placeholder, value } = props;
    const { actors, actorToOption, selectActor } = useActorDropDownViewModel();

    return (
        <DavitDropDown
            dropdownItems={actors.map((actor) => actorToOption(actor))}
            onSelect={(item) => onSelect(selectActor(Number(item.value), actors))}
            placeholder={placeholder}
            value={value}
        />
    );
};

export const ActorDropDownButton: FunctionComponent<ActorDropDownButtonProps> = (props) => {
    const { onSelect, icon } = props;
    const { actorToOption, actors, selectActor } = useActorDropDownViewModel();

    return (
        <DavitIconDropDown
            dropdownItems={actors.map((actor) => actorToOption(actor))}
            onSelect={(item) => onSelect(selectActor(Number(item.value), actors))}
            icon={icon}
        />
    );
};

const useActorDropDownViewModel = () => {
    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);

    const actorToOption = (actor: ActorCTO): DavitDropDownItemProps => {
        return {
            key: actor.actor.id,
            value: actor.actor.id.toString(),
            text: actor.actor.name,
        };
    };

    const selectActor = (actorId: number, actors: ActorCTO[]): ActorCTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(actors) && !DavitUtil.isNullOrUndefined(actorId)) {
            return actors.find((actor) => actor.actor.id === actorId);
        }
        return undefined;
    };

    return { actors, actorToOption, selectActor };
};
