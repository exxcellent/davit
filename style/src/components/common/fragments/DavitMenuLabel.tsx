import React, {FunctionComponent} from "react";
import {OptionField} from "../../controllPanel/presentation/fragments/edit/common/OptionField";

export interface DavitMenuLabelProps {
    text: string;
}

export const DavitMenuLabel: FunctionComponent<DavitMenuLabelProps> = (props) => {
    const {text} = props;

    return (
        <OptionField>
            <label className="davitMenuLabel">{text}</label>
        </OptionField>
    );
};
