import React, { FunctionComponent } from "react";
import { DavitAddButton } from "./buttons/DavitAddButton";

interface AddOrEditProps {
    addCallBack: () => void;
    label: string;
    dropDown: JSX.Element;
}

export const AddOrEdit: FunctionComponent<AddOrEditProps> = (props) => {
    const {addCallBack, label, dropDown} = props;

    return (
        <div style={{display: "flex"}}>
            <DavitAddButton onClick={() => addCallBack()}
                            style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}
            />
            <div className={"labelField border"}>
                <label>{label}</label>
            </div>
            {dropDown}
        </div>
    );
};
