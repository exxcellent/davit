import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal } from "semantic-ui-react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { ControllPanelActions } from "../../viewModel/ControllPanelActions";

export interface ControllPanelMetaComponentOptionsProps {}

export const ControllPanelMetaComponentOptions: FunctionComponent<ControllPanelMetaComponentOptionsProps> = (
  props
) => {
  const dispatch = useDispatch();

  // TODO: FileHandler Klasse erstellen und ins Backend stecken!
  const readFileToJSON = (file: File | null) => {
    const fileReader = new FileReader();
    let content: string;
    if (file !== null) {
      fileReader.readAsText(file);
      fileReader.onload = (event) => {
        console.log("result: " + event.target!.result);
        content = JSON.parse(event.target!.result as string);
        console.warn("content: " + JSON.stringify(content));
        const STORE_ID = "carv2";
        localStorage.setItem(STORE_ID, JSON.stringify(content));
      };
    }
  };

  const createNewComponent = () => {
    dispatch(ControllPanelActions.saveComponent(new ComponentCTO()));
  };

  return (
    <div>
      <Modal trigger={<Button icon="cloud upload" />}>
        <input
          type="file"
          onChange={(event) => {
            if (event.target.files !== null) {
              readFileToJSON(event.target.files[0]);
            }
          }}
        />
      </Modal>
      <Button icon="download" />
      <Button icon="add" onClick={createNewComponent}></Button>
    </div>
  );
};
