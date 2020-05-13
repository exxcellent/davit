import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import "./ControllPanelEdit.css";
import { ControllPanelFileOptions } from "./ControllPanelFileOptions";

export interface ControllPanelEditProps {}

export const ControllPanelEdit: FunctionComponent<ControllPanelEditProps> = (
  props
) => {
  const dispatch = useDispatch();

  const createNewComponent = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT_COMPONENT));
  };

  const createNewData = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT_DATA));
  };

  return (
    <div className="controllPanelEdit">
      <div className="controllPanelEditChild">
        <label>Component</label>
        <br />
        <ControllPanelFileOptions />
      </div>
      <div
        className="controllPanelEditChild"
        style={{ backgroundColor: "#e8ede6" }}
      >
        <label>Component</label>
        <br />
        <Button icon="add" onClick={createNewComponent}></Button>
      </div>
      <div
        className="controllPanelEditChild"
        style={{ backgroundColor: " #cff3c0" }}
      >
        <label>Data</label>
        <br />
        <Button icon="add" onClick={createNewData}></Button>
      </div>
      <div
        className="controllPanelEditChild"
        style={{ backgroundColor: "red" }}
      >
        <label>Sequence</label>
        <br />
        {/* <Button icon="add" onClick={createNewData}></Button> */}
      </div>
    </div>
  );
};
