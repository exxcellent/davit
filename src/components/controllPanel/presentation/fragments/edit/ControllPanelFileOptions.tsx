import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";

export interface ControllPanelFileOptionsProps {}

export const ControllPanelFileOptions: FunctionComponent<ControllPanelFileOptionsProps> = (
  props
) => {
  const dispatch = useDispatch();

  const [showUploadButton, setShowUploadButton] = React.useState<boolean>(
    false
  );

  const readFileToString = (file: File | null) => {
    const fileReader = new FileReader();
    if (file !== null) {
      console.log("reading file");
      fileReader.readAsText(file);
      fileReader.onload = (event) => {
        console.log("writing filee to storage");
        console.log(event.target!.result);
        dispatch(
          ControllPanelActions.storefileData(event.target!.result as string)
        );
        setShowUploadButton(false);
      };
    }
  };

  return (
    <div>
      <Button icon="cloud upload" onClick={() => setShowUploadButton(true)} />
      <Button icon="download" />
      <Button icon="edit" />
      {showUploadButton && (
        <input
          type="file"
          onChange={(event) => {
            if (event.target.files !== null) {
              readFileToString(event.target.files[0]);
            }
          }}
        />
      )}
    </div>
  );
};
