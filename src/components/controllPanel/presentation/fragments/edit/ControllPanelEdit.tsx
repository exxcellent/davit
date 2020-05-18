import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { Carv2AddButton } from "../../../../common/fragments/buttons/Carv2AddButton";
import { Carv2Button } from "../../../../common/fragments/buttons/Carv2Button";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import {
  useGetComponentDropdown,
  useGetDataDropdown,
} from "./common/fragments/Carv2DropDown";
import { OptionField } from "./common/OptionField";
import "./ControllPanelEdit.css";
import { ControllPanelFileOptions } from "./ControllPanelFileOptions";

export interface ControllPanelEditProps {}

export const ControllPanelEdit: FunctionComponent<ControllPanelEditProps> = (
  props
) => {
  const dispatch = useDispatch();

  const createNewComponent = () => {
    dispatch(ControllPanelActions.setComponentToEdit(new ComponentCTO()));
  };

  const createNewData = () => {
    dispatch(ControllPanelActions.setDataToEdit(new DataCTO()));
  };

  const editRelation = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT_DATA_RELATION));
  };

  const selectComponent = (component: ComponentCTO | undefined) => {
    dispatch(ControllPanelActions.setComponentToEdit(component || null));
  };

  const selectData = (data: DataCTO | undefined) => {
    dispatch(ControllPanelActions.setDataToEdit(data || null));
  };

  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <ControllPanelFileOptions />
      </div>
      <div className="optionFieldSpacer">
        <div className="columnDivider">
          <OptionField label="component">
            <Carv2AddButton onClick={createNewComponent} />
            {useGetComponentDropdown(selectComponent, "wrench")}
          </OptionField>
        </div>
      </div>
      <div className="optionFieldSpacer">
        <div className="columnDivider">
          <OptionField label="Data">
            <Carv2AddButton onClick={createNewData} />
            {useGetDataDropdown(selectData, "wrench")}
            <Carv2Button
              icon="arrows alternate horizontal"
              onClick={editRelation}
            />
          </OptionField>
        </div>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="sequence">
          <Carv2AddButton onClick={() => {}} />
        </OptionField>
      </div>
    </div>
  );
};
