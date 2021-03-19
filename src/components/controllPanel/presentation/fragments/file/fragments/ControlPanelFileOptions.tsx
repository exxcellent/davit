import React, {FunctionComponent} from "react";
import {useDispatch} from "react-redux";
import {EditActions} from "../../../../../../slices/EditSlice";
import {GlobalActions} from "../../../../../../slices/GlobalSlice";
import {DavitDeleteButton} from "../../../../../common/fragments/buttons/DavitDeleteButton";
import {DavitDownloadButton} from "../../../../../common/fragments/buttons/DavitDownloadButton";
import {DavitUploadButton} from "../../../../../common/fragments/buttons/DavitUploadButton";
import {OptionField} from "../../edit/common/OptionField";

export interface ControlPanelFileOptionsProps {
}

export const ControlPanelFileOptions: FunctionComponent<ControlPanelFileOptionsProps> = () => {
    const {deleteLocalStorage} = useFileOptionModelView();

    return (
            <OptionField label="file">
                <DavitUploadButton/>
                <DavitDownloadButton/>
                <DavitDeleteButton onClick={deleteLocalStorage}/>
            </OptionField>
    );
};

const useFileOptionModelView = () => {
    const dispatch = useDispatch();

    const deleteLocalStorage = () => {
        dispatch(EditActions.setMode.view());
        dispatch(GlobalActions.createNewProject());
    };

    return {
        deleteLocalStorage,
    };
};
