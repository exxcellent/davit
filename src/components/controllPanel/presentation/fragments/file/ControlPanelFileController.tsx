import React, {FunctionComponent} from "react";
import {ControlPanelEditSub} from "../edit/common/ControlPanelEditSub";
import {ControlPanelFileOptions} from "./fragments/ControlPanelFileOptions";

export interface ControlPanelFileControllerProps {
    hidden: boolean;
}

export const ControlPanelFileController: FunctionComponent<ControlPanelFileControllerProps> = (props) => {
    const {hidden} = props;

    return (
        <ControlPanelEditSub label="FILE" hidden={hidden}>
            <div className="optionFieldSpacer">
                <ControlPanelFileOptions/>
            </div>
        </ControlPanelEditSub>
    );
};