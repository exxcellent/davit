import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { DropdownProps } from 'semantic-ui-react';
import { ActorCTO } from '../../../../dataAccess/access/cto/ActorCTO';
import { DataCTO } from '../../../../dataAccess/access/cto/DataCTO';
import { ConditionTO } from '../../../../dataAccess/access/to/ConditionTO';
import { masterDataSelectors } from '../../../../slices/MasterDataSlice';
import { DavitDropDownItemProps, DavitIconDropDown } from './DavitDropDown';

interface ConditionDropDownButtonProps extends DropdownProps {
    onSelect: (conditionId: number | undefined) => void;
    conditions: ConditionTO[];
    icon?: string;
}

export const ConditionDropDownButton: FunctionComponent<ConditionDropDownButtonProps> = (props) => {
    const { onSelect, icon, conditions } = props;

    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);

    const conditionToOption = (condition: ConditionTO): DavitDropDownItemProps => {
        const actorName: string =
            actors.find((actor) => actor.actor.id === condition.actorFk)?.actor.name || 'Could not find Actor';
        let dataName: string = 'Could not find Data';
        let instanceName: string = 'Could not find Instance';
        const data: DataCTO | undefined = datas.find((data) => data.data.id === condition.dataFk);

        if (data) {
            dataName = data.data.name;
            instanceName =
                data.data.instances.find((instance) => instance.id === condition.instanceFk)?.name ||
                'Could not find Instance';
        }

        return {
            key: condition.id,
            value: condition.id.toString(),
            text: `${actorName} - ${dataName}: ${instanceName}`,
        };
    };

    return (
        <DavitIconDropDown
            dropdownItems={conditions.map((condition, index) => {
                return conditionToOption(condition);
            })}
            onSelect={(condition) => onSelect(Number(condition.value))}
            icon={icon}
        />
    );
};
