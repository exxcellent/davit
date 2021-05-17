import React, {FunctionComponent} from 'react';
import "./Modal.css";

interface DavitModalProps {
}

export const DavitModal: FunctionComponent<DavitModalProps> = (props) => {
    const {children} = props;

    return <div className='davitModal'>{children}</div>;
};
