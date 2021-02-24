import React, { FunctionComponent } from "react";

interface DavitModalProps {
    content: JSX.Element;
}

export const DavitModal: FunctionComponent<DavitModalProps> = (props) => {
    const { content } = props;

    return <div className="davitModal">{content}</div>;
};
