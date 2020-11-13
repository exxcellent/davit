import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {Dropdown, DropdownItemProps, DropdownProps} from 'semantic-ui-react';
import {ChainTO} from '../../../../dataAccess/access/to/ChainTO';
import {masterDataSelectors} from '../../../../slices/MasterDataSlice';
import {DavitUtil} from '../../../../utils/DavitUtil';

interface ChainDropDownProps extends DropdownProps {
  onSelect: (chain: ChainTO | undefined) => void;
  placeholder?: string;
  value?: number;
}

interface ChainDropDownPropsButton extends DropdownProps {
  onSelect: (chain: ChainTO | undefined) => void;
  icon?: string;
}

export const ChainDropDown: FunctionComponent<ChainDropDownProps> = (props) => {
  const {onSelect, placeholder, value} = props;
  const {chainToOption, chains, selectChain} = useChainDropDownViewModel();

  return (
    <Dropdown
      options={chains.map(chainToOption)}
      placeholder={placeholder || 'Select Chain ...'}
      onChange={(event, sequence) => onSelect(selectChain(Number(sequence.value)))}
      floating
      selectOnBlur={false}
      scrolling
      clearable
      selection
      value={value}
      disabled={chains.length > 0 ? false : true}
    />
  );
};

export const ChainDropDownButton: FunctionComponent<ChainDropDownPropsButton> = (props) => {
  const {onSelect, icon} = props;
  const {selectChain, chainToOption, chains} = useChainDropDownViewModel();

  return (
    <Dropdown
      options={chains.map(chainToOption)}
      icon={chains.length > 0 ? icon : ''}
      onChange={(event, sequence) => onSelect(selectChain(Number(sequence.value)))}
      className="button icon"
      inverted="true"
      color="orange"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={chains.length > 0 ? false : true}
    />
  );
};

const useChainDropDownViewModel = () => {
  const chains: ChainTO[] = useSelector(masterDataSelectors.chains);

  const selectChain = (id: number): ChainTO | undefined => {
    if (!DavitUtil.isNullOrUndefined(id) && !DavitUtil.isNullOrUndefined(chains)) {
      return chains.find((chain) => chain.id === id);
    }
    return undefined;
  };

  const chainToOption = (chain: ChainTO): DropdownItemProps => {
    return {
      key: chain.id,
      value: chain.id,
      text: chain.name,
    };
  };

  return {chainToOption, selectChain, chains};
};
