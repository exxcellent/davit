import React, { FunctionComponent } from "react";
import { ControlPanel } from "../edit/common/ControlPanel";
import { OptionField } from "../edit/common/OptionField";
import { ControlPanelFileOptions } from "./fragments/ControlPanelFileOptions";

export interface ControlPanelFileControllerProps {
}

export const ControlPanelFileController: FunctionComponent<ControlPanelFileControllerProps> = () => {

    return (
        <ControlPanel>
            <OptionField>
                <ControlPanelFileOptions />
            </OptionField>
        </ControlPanel>
    );
};
