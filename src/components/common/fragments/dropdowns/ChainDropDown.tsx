import React, {FunctionComponent} from 'react';
import {useSelector} from 'react-redux';
import {DropdownProps} from 'semantic-ui-react';
import {ChainTO} from '../../../../dataAccess/access/to/ChainTO';
import {masterDataSelectors} from '../../../../slices/MasterDataSlice';
import {DavitUtil} from '../../../../utils/DavitUtil';
import {DavitDropDown, DavitDropDownItemProps, DavitIconDropDown} from './DavitDropDown';

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
    <DavitDropDown
      dropdownItems={chains.map(chainToOption)}
      onSelect={(sequence) => onSelect(selectChain(Number(sequence.value)))}
      placeholder={placeholder}
      value={value ? value.toString() : undefined}
      clearable={true}
    />
  );
};

export const ChainDropDownButton: FunctionComponent<ChainDropDownPropsButton> = (props) => {
  const {onSelect, icon} = props;
  const {selectChain, chainToOption, chains} = useChainDropDownViewModel();

  return (
    <DavitIconDropDown
      dropdownItems={chains.map(chainToOption)}
      onSelect={(chain) => onSelect(selectChain(Number(chain.value)))}
      icon={icon}
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

  const chainToOption = (chain: ChainTO): DavitDropDownItemProps => {
    return {
      key: chain.id,
      value: chain.id.toString(),
      text: chain.name,
    };
  };

  return {chainToOption, selectChain, chains};
};
