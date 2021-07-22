import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import React, { FunctionComponent } from "react";
import { ElementSize } from "../../../style/Theme";
import { DavitIconButton } from "./DavitIconButton";

interface DavitMoreButtonProps {
    onClick: (show: boolean) => void;
    show?: boolean;
    className?: string;
}

export const DavitShowMoreButton: FunctionComponent<DavitMoreButtonProps> = (props) => {
    const {onClick, show, className} = props;

    return <DavitIconButton onClick={() => onClick(!show)}
                            size={ElementSize.tiny}
                            iconName={show ? faAngleDown : faAngleRight}
                            className={className}
    />;
};
