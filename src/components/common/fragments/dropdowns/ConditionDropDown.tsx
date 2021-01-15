import React, { FunctionComponent } from 'react';
import { DropdownProps } from 'semantic-ui-react';
import { ConditionTO } from '../../../../dataAccess/access/to/ConditionTO';
import { DavitDropDownItemProps, DavitIconDropDown } from './DavitDropDown';

interface ConditionDropDownButtonProps extends DropdownProps {
    onSelect: (conditionIndex: number | undefined) => void;
    conditions: ConditionTO[];
    icon?: string;
}

export const ConditionDropDownButton: FunctionComponent<ConditionDropDownButtonProps> = (props) => {
    const { onSelect, icon, conditions } = props;

    const conditionToOption = (condition: ConditionTO, index: number): DavitDropDownItemProps => {
        return {
            key: index,
            value: index.toString(),
            text: 'Actor: ' + condition.actorFk.toString() + ' + Data: ' + condition.dataFk.toString(),
        };
    };

    return (
        <DavitIconDropDown
            dropdownItems={conditions.map((condition, index) => {
                return conditionToOption(condition, index);
            })}
            onSelect={(condition) => onSelect(Number(condition.value))}
            icon={icon}
        />
    );
};
