import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { GlobalActions } from "../../../../../slices/GlobalSlice";
import { DavitButton } from "../../../../common/fragments/buttons/DavitButton";
import { ControllPanelEditSub } from "../edit/common/ControllPanelEditSub";
import { DavitLabelTextfield } from "../edit/common/fragments/DavitLabelTextfield";
import { ControllPanelFileOptions } from "./fragments/ControllPanelFileOptions";

export interface ControllPanelFileControllerProps {
    hidden: boolean;
}

export const ControllPanelFileController: FunctionComponent<ControllPanelFileControllerProps> = (props) => {
    const { hidden } = props;
    const {
        showExportFile,
        toggleShowExportFile,
        projectName,
        setProjectName,
        downloadData,
    } = useControllPanelFileViewModel();

    return (
        <ControllPanelEditSub label="FILE" hidden={hidden}>
            <div className="optionFieldSpacer">
                <ControllPanelFileOptions showDownloadFile={toggleShowExportFile} />
            </div>
            <div className="columnDivider controllPanelEditChild">
                {showExportFile && (
                    <DavitLabelTextfield
                        label="Export file name:"
                        placeholder="project"
                        onChangeDebounced={(name: string) => setProjectName(name)}
                        value={projectName}
                        autoFocus
                        unvisible={hidden}
                    />
                )}
            </div>
            <div className="columnDivider controllPanelEditChild">
                {showExportFile && <DavitButton label="Export File" onClick={downloadData} />}
            </div>
            <div className="columnDivider controllPanelEditChild" />
        </ControllPanelEditSub>
    );
};

const useControllPanelFileViewModel = () => {
    const dispatch = useDispatch();
    const [showExportFile, setShowExportFile] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>("");

    const toggleShowExportFile = () => {
        setShowExportFile(!showExportFile);
    };

    const downloadData = () => {
        dispatch(GlobalActions.downloadData(projectName !== "" ? projectName : "project"));
        setProjectName("");
        toggleShowExportFile();
    };

    return {
        showExportFile,
        toggleShowExportFile,
        projectName,
        setProjectName,
        downloadData,
    };
};
