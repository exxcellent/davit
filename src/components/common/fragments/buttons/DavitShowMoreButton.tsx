import React, { CSSProperties, FunctionComponent, useEffect, useState } from 'react';
import { DavitButton } from './DavitButton';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';

interface DavitMoreButtonProps {
    onClick: () => void;
    style?: CSSProperties;
    show?: boolean
}

export const DavitShowMoreButton: FunctionComponent<DavitMoreButtonProps> = (props) => {
    const { onClick, style, show } = props;

    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        if(show !== undefined){
            setShowMore(show);
        }
    }, [show]);

    return <DavitButton onClick={() => {
        onClick();
        setShowMore(!showMore);
    }} iconName={showMore ? faAngleDown : faAngleRight} style={style}/>;
};
