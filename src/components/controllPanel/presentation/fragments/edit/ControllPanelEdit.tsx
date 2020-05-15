import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { OptionField } from "./common/OptionField";
import { OptionFieldData } from "./common/OptionFieldData";
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

  const editRelation = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT_DATA_RELATION));
  };

  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <div className="columnDivider">
          <ControllPanelFileOptions />
        </div>
      </div>
      <div className="optionFieldSpacer">
        <div className="columnDivider">
          <OptionField
            onAddButtonCallBack={createNewComponent}
            onEditButtonCallBack={() => {}}
            label="component"
          />
        </div>
      </div>
      <div className="optionFieldSpacer">
        <div className="columnDivider">
          <OptionFieldData
            onAddButtonCallBack={createNewData}
            onEditButtonCallBack={() => {}}
            onEditRelationCallBack={editRelation}
            label="data"
          />
        </div>
      </div>
      <div className="optionFieldSpacer">
        <OptionField
          onAddButtonCallBack={createNewComponent}
          onEditButtonCallBack={() => {}}
          label="sequence"
        />
      </div>
    </div>
  );
};
