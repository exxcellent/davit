import React, { FunctionComponent } from "react";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { GoToTypes } from "../../../../dataAccess/access/types/GoToType";
import { GoToTypesChain } from "../../../../dataAccess/access/types/GoToTypeChain";

interface GoToChainOptionDropDownProps extends DropdownProps {
  onSelect: (gotoType: GoToTypesChain | undefined) => void;
  value?: GoToTypesChain;
}

export const GoToChainOptionDropDown: FunctionComponent<GoToChainOptionDropDownProps> = (props) => {
  const { onSelect, value } = props;

  const getOptions = (): DropdownItemProps[] => {
    return Object.values(GoToTypesChain).map(goToToOption);
  };

  const goToToOption = (goTo: GoToTypesChain): DropdownItemProps => {
    return {
      key: goTo,
      value: goTo,
      text: goTo,
    };
  };

  const selectGotoType = (gotoType: string | undefined): GoToTypesChain | undefined => {
    return gotoType ? (GoToTypesChain as any)[gotoType] : undefined;
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
