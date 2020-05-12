import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import "./ControllPanelEdit.css";
import { ControllPanelFileOptions } from "./ControllPanelFileOptions";

export interface ControllPanelEditProps {}

export const ControllPanelEdit: FunctionComponent<ControllPanelEditProps> = (
  props
) => {
  const dispatch = useDispatch();

  const createNewComponent = () => {
    dispatch(ControllPanelActions.saveComponent(new ComponentCTO()));
  };

  const createNewData = () => {
    dispatch(ControllPanelActions.saveData(new DataCTO()));
  };

  return (
    <div className="controllPanelEdit">
      <div className="controllPanelEditChild">
        <ControllPanelFileOptions />
      </div>
      <div className="controllPanelEditChild">
        <Button icon="add" onClick={createNewComponent}></Button>
      </div>
      <div className="controllPanelEditChild">
        <Button icon="add" onClick={createNewData}></Button>
      </div>
    </div>
  );
};
