import React, {FunctionComponent} from "react";
import {DavitAddButton} from './buttons/DavitAddButton';

interface AddOrEditProps {
    addCallBack: () => void;
    dropDown: JSX.Element;
}

export const AddOrEdit: FunctionComponent<AddOrEditProps> = (props) => {
    const {addCallBack, dropDown} = props;

    return (
        <div style={{display: "flex"}}>
            <DavitAddButton onClick={() => addCallBack()}/>
            {dropDown}
        </div>
    );
};
