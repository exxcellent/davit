import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {Dropdown, DropdownItemProps, DropdownProps} from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';
import {ChainDecisionTO} from '../../../../dataAccess/access/to/ChainDecisionTO';
import {masterDataSelectors} from '../../../../slices/MasterDataSlice';
import {Carv2Util} from '../../../../utils/Carv2Util';

interface ChainDecisionDropDownButtonProps extends DropdownProps {
  onSelect: (link: ChainDecisionTO | undefined) => void;
  chainId: number;
  icon?: string;
  exclude?: number;
}

interface ChainDecisionDropDownProps extends DropdownProps {
  onSelect: (link: ChainDecisionTO | undefined) => void;
  chainId: number;
  placeholder?: string;
  value?: number;
  exclude?: number;
}

export const ChainDecisionDropDownButton: FunctionComponent<ChainDecisionDropDownButtonProps> = (props) => {
  const {onSelect, icon, chainId, exclude} = props;
  const {createDecisionOptions, selectChainDecision} = useChainDecisionDropDownViewModel(chainId, exclude);

  return (
    <Dropdown
      options={createDecisionOptions()}
      icon={createDecisionOptions().length === 0 ? '' : icon}
      onChange={(event, data) => onSelect(selectChainDecision(Number(data.value)))}
      className="button icon"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={createDecisionOptions().length === 0}
    />
  );
};

export const ChainDecisionDropDown: FunctionComponent<ChainDecisionDropDownProps> = (props) => {
  const {onSelect, placeholder, value, chainId, exclude} = props;
  const {createDecisionOptions, selectChainDecision} = useChainDecisionDropDownViewModel(chainId, exclude);

  return (
    <Dropdown
      options={createDecisionOptions()}
      selection
      selectOnBlur={false}
      placeholder={placeholder || 'Select link ...'}
      onChange={(event, data) => onSelect(selectChainDecision(Number(data.value)))}
      scrolling
      value={value === -1 ? undefined : value}
      disabled={createDecisionOptions().length === 0}
    />
  );
};

const useChainDecisionDropDownViewModel = (chainId: number, exclude?: number) => {
  const chainDecisions: ChainDecisionTO[] = useSelector(masterDataSelectors.chainDecisions);

  const chainDecisionToOption = (decision: ChainDecisionTO): DropdownItemProps => {
    return {
      key: decision.id,
      value: decision.id,
      text: decision.name,
    };
  };

  const createDecisionOptions = (): DropdownItemProps[] => {
    if (!isNullOrUndefined(chainDecisions)) {
      let copyDecision: ChainDecisionTO[] = Carv2Util.deepCopy(chainDecisions);
      copyDecision = copyDecision.filter((dec) => dec.chainFk === chainId);
      if (exclude) {
        copyDecision = copyDecision.filter((dec) => dec.id !== exclude);
      }
      return copyDecision.map(chainDecisionToOption);
    }
    return [];
  };

  const selectChainDecision = (id: number): ChainDecisionTO | undefined => {
    if (!isNullOrUndefined(chainDecisions) && !isNullOrUndefined(id)) {
      return chainDecisions.find((step) => step.id === id);
    }
    return undefined;
  };

  return {createDecisionOptions, selectChainDecision};
};
