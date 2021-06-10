import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import React, { FunctionComponent, useEffect, useState } from "react";
import { ElementSize } from "../../../style/Theme";
import { DavitButtonProps } from "./DavitButton";
import { DavitIconButton } from "./DavitIconButton";

interface DavitMoreButtonProps extends DavitButtonProps {
    show?: boolean
}

export const DavitShowMoreButton: FunctionComponent<DavitMoreButtonProps> = (props) => {
    const {onClick, show} = props;

    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        if (show !== undefined) {
            setShowMore(show);
        }
    }, [show]);

    const onToggle = () => {
        setShowMore(!showMore);
        onClick();
    };

    return <DavitIconButton onClick={onToggle}
                            size={ElementSize.tiny}
                            iconName={showMore ? faAngleDown : faAngleRight}
    />;
};
