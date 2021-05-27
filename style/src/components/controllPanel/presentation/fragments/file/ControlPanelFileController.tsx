import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { EditActions } from "../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../slices/GlobalSlice";
import { DavitDeleteButton } from "../../../../common/fragments/buttons/DavitDeleteButton";
import { DavitDownloadButton } from "../../../../common/fragments/buttons/DavitDownloadButton";
import { DavitUploadButton } from "../../../../common/fragments/buttons/DavitUploadButton";
import { ControlPanel } from "../edit/common/ControlPanel";
import { OptionField } from "../edit/common/OptionField";

export interface ControlPanelFileControllerProps {
}

export const ControlPanelFileController: FunctionComponent<ControlPanelFileControllerProps> = () => {

    const dispatch = useDispatch();

    const deleteLocalStorage = () => {
        dispatch(EditActions.setMode.view());
        dispatch(GlobalActions.createNewProject());
    };

    return (
        <ControlPanel>
            <OptionField label="Upload">
                <DavitUploadButton />
            </OptionField>
            <OptionField label="Download">
                <DavitDownloadButton />
            </OptionField>
            <OptionField label="Clear">
                <DavitDeleteButton onClick={deleteLocalStorage} />
            </OptionField>
        </ControlPanel>
    );
};
