import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal } from "semantic-ui-react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { ControllPanelActions } from "../../viewModel/ControllPanelActions";

export interface ControllPanelMetaComponentOptionsProps {}

export const ControllPanelMetaComponentOptions: FunctionComponent<ControllPanelMetaComponentOptionsProps> = (
  props
) => {
  const dispatch = useDispatch();

  const [showUploadModal, setShowUploadModal] = React.useState<boolean>(false);

  const createNewComponent = () => {
    dispatch(ControllPanelActions.saveComponent(new ComponentCTO()));
  };

  const createNewData = () => {
    dispatch(ControllPanelActions.saveData(new DataCTO()));
  };

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
        setShowUploadModal(false);
      };
    }
  };

  return (
    <div>
      <Button icon="cloud upload" onClick={() => setShowUploadModal(true)} />
      <Modal open={showUploadModal}>
        <input
          type="file"
          onChange={(event) => {
            if (event.target.files !== null) {
              readFileToString(event.target.files[0]);
            }
          }}
        />
      </Modal>
      <Button icon="download" />
      <Button icon="add" onClick={createNewComponent}></Button>
      <Button icon="add" onClick={createNewData}></Button>
    </div>
  );
};
