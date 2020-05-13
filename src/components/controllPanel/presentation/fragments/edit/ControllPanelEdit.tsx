import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import "./ControllPanelEdit.css";
import { ControllPanelFileOptions } from "./ControllPanelFileOptions";
import { OptionField } from "./OptionField";

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
        <label>File</label>
        <br />
        <ControllPanelFileOptions />
      </div>

      <OptionField
        title="Component"
        onAddButtonCallBack={createNewComponent}
        onEditButtonCallBack={() => {}}
      />
      <OptionField
        title="Data"
        onAddButtonCallBack={createNewData}
        onEditButtonCallBack={() => {}}
      />
      <OptionField
        title="Sequence"
        onAddButtonCallBack={() => {}}
        onEditButtonCallBack={() => {}}
      />
    </div>
  );
};
