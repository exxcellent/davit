import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { ButtonGroup } from "semantic-ui-react";
import { EditActions } from "../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../slices/GlobalSlice";
import { DavitButtonIcon } from "../../../../../common/fragments/buttons/DavitButton";
import { DavitFileInput } from "../../../../../common/fragments/buttons/DavitFileInput";

export interface ControllPanelFileOptionsProps {
    showDownloadFile: () => void;
}

export const ControllPanelFileOptions: FunctionComponent<ControllPanelFileOptionsProps> = (props) => {
    const { showDownloadFile } = props;
    const { deleteLocalStorage } = useFileOptionModelView();

    return (
        <div>
            <div className="optionField">
                <ButtonGroup>
                    <DavitFileInput />
                    <DavitButtonIcon icon="download" onClick={showDownloadFile} />
                    <DavitButtonIcon icon="trash alternate" onClick={deleteLocalStorage} />
                </ButtonGroup>
            </div>
            <div style={{ textAlign: "center", color: "white" }}>{"file".toUpperCase()}</div>
        </div>
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
