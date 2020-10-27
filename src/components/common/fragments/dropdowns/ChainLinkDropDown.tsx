import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ChainlinkTO } from "../../../../dataAccess/access/to/ChainlinkTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";
import { Carv2Util } from "../../../../utils/Carv2Util";

interface ChainLinkDropDownButtonProps extends DropdownProps {
  onSelect: (link: ChainlinkTO | undefined) => void;
  chainId: number;
  icon?: string;
  exclude?: number;
}

interface ChainLinkDropDownProps extends DropdownProps {
  onSelect: (link: ChainlinkTO | undefined) => void;
  chainId: number;
  placeholder?: string;
  value?: number;
  exclude?: number;
}

export const ChainLinkDropDownButton: FunctionComponent<ChainLinkDropDownButtonProps> = (props) => {
  const { onSelect, icon, chainId, exclude } = props;
  const { selectChainLink, linkOptions } = useChainStepDropDownViewModel(chainId, exclude);

  return (
    <Dropdown
      options={linkOptions()}
      icon={linkOptions().length === 0 ? "" : icon}
      onChange={(event, data) => onSelect(selectChainLink(Number(data.value)))}
      className="button icon"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={linkOptions().length === 0}
    />
  );
};

export const ChainLinkDropDown: FunctionComponent<ChainLinkDropDownProps> = (props) => {
  const { onSelect, placeholder, value, chainId, exclude } = props;
  const { linkOptions, selectChainLink } = useChainStepDropDownViewModel(chainId, exclude);

  return (
    <Dropdown
      options={linkOptions()}
      selection
      selectOnBlur={false}
      placeholder={placeholder || "Select link ..."}
      onChange={(event, data) => onSelect(selectChainLink(Number(data.value)))}
      scrolling
      value={value === -1 ? undefined : value}
      disabled={linkOptions().length === 0}
    />
  );
};

const useChainStepDropDownViewModel = (chainId: number, exclude?: number) => {
  const chainlinks: ChainlinkTO[] = useSelector(masterDataSelectors.chainLinks);

  const chainStepToOption = (link: ChainlinkTO): DropdownItemProps => {
    return {
      key: link.id,
      value: link.id,
      text: link.name,
    };
  };

  const linkOptions = (): DropdownItemProps[] => {
    if (!isNullOrUndefined(chainlinks)) {
      let copyLinks: ChainlinkTO[] = Carv2Util.deepCopy(chainlinks);
      copyLinks = copyLinks.filter((link) => link.chainFk === chainId);
      if (exclude) {
        copyLinks = copyLinks.filter((link) => link.id !== exclude);
      }
      return copyLinks.map(chainStepToOption);
    }
    return [];
  };

  const selectChainLink = (id: number): ChainlinkTO | undefined => {
    if (!isNullOrUndefined(chainlinks) && !isNullOrUndefined(id)) {
      return chainlinks.find((step) => step.id === id);
    }
    return undefined;
  };

  return { linkOptions, selectChainLink };
};
