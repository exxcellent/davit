import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ChainStepTO } from "../../../../dataAccess/access/to/ChainStepTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";
import { Carv2Util } from "../../../../utils/Carv2Util";

interface ChainStepDropDownButtonProps extends DropdownProps {
  onSelect: (step: ChainStepTO | undefined) => void;
  chainId: number;
  icon?: string;
}

interface ChainStepDropDownProps extends DropdownProps {
  onSelect: (step: ChainStepTO | undefined) => void;
  chainId: number;
  placeholder?: string;
  value?: number;
}

export const ChainStepDropDownButton: FunctionComponent<ChainStepDropDownButtonProps> = (props) => {
  const { onSelect, icon, chainId } = props;
  const { chainSteps, stepOptions, selectChainStep } = useChainStepDropDownViewModel(chainId);

  return (
    <Dropdown
      options={stepOptions()}
      icon={chainSteps ? (chainSteps.length > 0 ? icon : "") : ""}
      onChange={(event, data) => onSelect(selectChainStep(Number(data.value)))}
      className="button icon"
      floating
      selectOnBlur={false}
      trigger={<React.Fragment />}
      scrolling
      disabled={chainSteps ? (chainSteps.length > 0 ? false : true) : false}
    />
  );
};

export const ChainStepDropDown: FunctionComponent<ChainStepDropDownProps> = (props) => {
  const { onSelect, placeholder, value, chainId } = props;
  const { selectChainStep, stepOptions, chainSteps } = useChainStepDropDownViewModel(chainId);

  return (
    <Dropdown
      options={stepOptions()}
      selection
      selectOnBlur={false}
      placeholder={placeholder || "Select step ..."}
      onChange={(event, data) => onSelect(selectChainStep(Number(data.value)))}
      scrolling
      value={value === -1 ? undefined : value}
      disabled={chainSteps ? (chainSteps.length > 0 ? false : true) : false}
    />
  );
};

const useChainStepDropDownViewModel = (chainId: number) => {
  const chainSteps: ChainStepTO[] = useSelector(masterDataSelectors.chainSteps);

  const chainStepToOption = (step: ChainStepTO): DropdownItemProps => {
    return {
      key: step.id,
      value: step.id,
      text: step.name,
    };
  };

  const stepOptions = (): DropdownItemProps[] => {
    if (!isNullOrUndefined(chainSteps)) {
      let copySteps: ChainStepTO[] = Carv2Util.deepCopy(chainSteps);
      copySteps = copySteps.filter((step) => step.chainFk === chainId);
      return copySteps.map(chainStepToOption);
    }
    return [];
  };

  const selectChainStep = (id: number): ChainStepTO | undefined => {
    if (!isNullOrUndefined(chainSteps) && !isNullOrUndefined(id)) {
      return chainSteps.find((step) => step.id === id);
    }
    return undefined;
  };

  return { stepOptions, selectChainStep, chainSteps };
};
