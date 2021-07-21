import React, { FunctionComponent } from "react";
import { DavitButton } from "../atomic";

interface ToggleButtonProps {
    toggleCallback: (isLeft: boolean) => void;
    isLeft: boolean;
    leftLabel: string;
    rightLabel: string;
}

export const ToggleButton: FunctionComponent<ToggleButtonProps> = (props) => {
    const {toggleCallback, isLeft, leftLabel, rightLabel} = props;

    return (
        <div className="flex flex-center">
            <DavitButton
                className={isLeft ? " active" : ""}
                onClick={() => toggleCallback(true)}
            >{leftLabel}</DavitButton>
            <DavitButton
                className={isLeft ? "" : " active"}
                onClick={() => toggleCallback(false)}
            >{rightLabel}</DavitButton>
        </div>
    );
};

