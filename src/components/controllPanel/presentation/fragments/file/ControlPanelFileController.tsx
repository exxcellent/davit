import React, {FunctionComponent, useState} from "react";
import {DavitModal} from "../../../../common/fragments/DavitModal";
import {DavitDownloadForm} from "../../../../common/fragments/forms/DavitDownloadForm";
import {ControlPanelEditSub} from "../edit/common/ControlPanelEditSub";
import {ControlPanelFileOptions} from "./fragments/ControlPanelFileOptions";

export interface ControlPanelFileControllerProps {
    hidden: boolean;
}

export const ControlPanelFileController: FunctionComponent<ControlPanelFileControllerProps> = (props) => {
    const {hidden} = props;
    const [showDownloadForm, setShowDownloadForm] = useState<boolean>(false);

    return (
        <ControlPanelEditSub label="FILE" hidden={hidden}>
            <div className="optionFieldSpacer">
                <ControlPanelFileOptions showDownloadFile={() => setShowDownloadForm(true)}/>
            </div>
            {showDownloadForm && (
                <DavitModal content={<DavitDownloadForm onCloseCallback={() => setShowDownloadForm(false)}/>}/>
            )}
        </ControlPanelEditSub>
    );
};