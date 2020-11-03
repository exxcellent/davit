import React, {FunctionComponent} from 'react';
import {Dropdown, DropdownItemProps, DropdownProps} from 'semantic-ui-react';
import {GoToTypes} from '../../../../dataAccess/access/types/GoToType';

interface GoToOptionDropDownProps extends DropdownProps {
  onSelect: (gotoType: GoToTypes | undefined) => void;
  value?: GoToTypes;
}

export const GoToOptionDropDown: FunctionComponent<GoToOptionDropDownProps> = (props) => {
  const {onSelect, value} = props;

  const getOptions = (): DropdownItemProps[] => {
    return Object.values(GoToTypes).map(goToToOption);
  };

  const goToToOption = (goTo: GoToTypes): DropdownItemProps => {
    return {
      key: goTo,
      value: goTo,
      text: goTo,
    };
  };

  const selectGotoType = (gotoType: string | undefined): GoToTypes | undefined => {
    return gotoType ? (GoToTypes as any)[gotoType] : undefined;
  };

  return (
    <Dropdown
      options={getOptions()}
      selection
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectGotoType(data.value as string))}
      scrolling
      value={value ? value : GoToTypes.ERROR}
      compact
    />
  );
};
