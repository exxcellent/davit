import React, { FunctionComponent } from 'react';
import { ControlPanelFileOptions } from './fragments/ControlPanelFileOptions';
import { ControlPanel } from '../edit/common/ControlPanel';
import { OptionField } from '../edit/common/OptionField';

export interface ControlPanelFileControllerProps {
}

export const ControlPanelFileController: FunctionComponent<ControlPanelFileControllerProps> = () => {

    return (
        <ControlPanel>
            <OptionField>
                <ControlPanelFileOptions/>
            </OptionField>
        </ControlPanel>
    );
};
