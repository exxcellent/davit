import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { DropdownProps } from "semantic-ui-react";
import { ChainlinkTO } from "../../../../dataAccess/access/to/ChainlinkTO";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../../utils/DavitUtil";
import { DavitDropDown, DavitDropDownItemProps, DavitIconDropDown } from "./DavitDropDown";

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

export const ChainLinkDropDown: FunctionComponent<ChainLinkDropDownProps> = (props) => {
    const { onSelect, placeholder, value, chainId, exclude } = props;
    const { linkOptions, selectChainLink } = useChainStepDropDownViewModel(chainId, exclude);

    const validatedValue = (): string | undefined => {
        return value ? (value === -1 ? undefined : value.toString()) : undefined;
    };

    return (
        <DavitDropDown
            dropdownItems={linkOptions()}
            value={validatedValue()}
            placeholder={placeholder}
            onSelect={(chainLink) => onSelect(selectChainLink(Number(chainLink.value)))}
        />
    );
};

export const ChainLinkDropDownButton: FunctionComponent<ChainLinkDropDownButtonProps> = (props) => {
    const { onSelect, icon, chainId, exclude } = props;
    const { selectChainLink, linkOptions } = useChainStepDropDownViewModel(chainId, exclude);

    return (
        <DavitIconDropDown
            dropdownItems={linkOptions()}
            onSelect={(link) => onSelect(selectChainLink(Number(link.value)))}
            icon={icon}
        />
    );
};

const useChainStepDropDownViewModel = (chainId: number, exclude?: number) => {
    const chainlinks: ChainlinkTO[] = useSelector(masterDataSelectors.selectChainLinks);

    const chainStepToOption = (link: ChainlinkTO): DavitDropDownItemProps => {
        return {
            key: link.id,
            value: link.id.toString(),
            text: link.name,
        };
    };

    const linkOptions = (): DavitDropDownItemProps[] => {
        if (!DavitUtil.isNullOrUndefined(chainlinks)) {
            let copyLinks: ChainlinkTO[] = DavitUtil.deepCopy(chainlinks);
            copyLinks = copyLinks.filter((link) => link.chainFk === chainId);
            if (exclude) {
                copyLinks = copyLinks.filter((link) => link.id !== exclude);
            }
            return copyLinks.map(chainStepToOption);
        }
        return [];
    };

    const selectChainLink = (id: number): ChainlinkTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(chainlinks) && !DavitUtil.isNullOrUndefined(id)) {
            return chainlinks.find((step) => step.id === id);
        }
        return undefined;
    };

    return { linkOptions, selectChainLink };
};
