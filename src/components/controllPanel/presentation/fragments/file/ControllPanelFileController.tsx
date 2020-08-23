import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { GlobalActions } from "../../../../../slices/GlobalSlice";
import { Carv2ButtonLabel } from "../../../../common/fragments/buttons/Carv2Button";
import { ControllPanelEditSub } from "../edit/common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../edit/common/fragments/Carv2LabelTextfield";
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
          <Carv2LabelTextfield
            label="Export file name:"
            placeholder="project"
            onChange={(event: any) => setProjectName(event.target.value)}
            value={projectName}
            autoFocus
            unvisible={hidden}
          />
        )}
      </div>
      <div className="columnDivider controllPanelEditChild">
        {showExportFile && <Carv2ButtonLabel label="Export File" onClick={downloadData}></Carv2ButtonLabel>}
      </div>
      <div className="columnDivider controllPanelEditChild"></div>
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
