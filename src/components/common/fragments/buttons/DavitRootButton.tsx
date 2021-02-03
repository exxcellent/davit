import React, { FunctionComponent } from "react";
import { DavitButtonLabel } from "./DavitButton";

interface DavitRootButtonProps {
    onClick: () => void;
    isRoot: boolean;
}

export const DavitRootButton: FunctionComponent<DavitRootButtonProps> = (props) => {
    const { onClick, isRoot } = props;

    return <DavitButtonLabel onClick={onClick} label={isRoot ? "Start" : "Set as Start"} disable={isRoot} />;
};
