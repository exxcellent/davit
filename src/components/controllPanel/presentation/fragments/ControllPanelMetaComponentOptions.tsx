import React, { FunctionComponent } from "react";
import { Button, Modal } from "semantic-ui-react";

export interface ControllPanelMetaComponentOptionsProps {}

export const ControllPanelMetaComponentOptions: FunctionComponent<ControllPanelMetaComponentOptionsProps> = (
  props
) => {
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
      // content = fileReader.readAsText(event.target.result);
    }
  };

  return (
    <div>
      <Modal trigger={<Button icon="cloud upload" />}>
        <input
          type="file"
          onChange={(event) => {
            // TODO: FileHandler Klasse erstellen und ins Backend stecken!
            if (event.target.files !== null) {
              readFileToJSON(event.target.files[0]);
            }
          }}
        />
      </Modal>
      <Button icon="download" />
      <Button icon="add"></Button>
    </div>
  );
};
