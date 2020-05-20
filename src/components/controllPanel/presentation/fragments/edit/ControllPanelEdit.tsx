import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../../dataAccess/access/cto/DataRelationCTO";
import { Carv2AddButton } from "../../../../common/fragments/buttons/Carv2AddButton";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import {
  useGetComponentDropdown,
  useGetDataDropdown,
  useGetRelationDropdown,
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

  const createNewRelation = () => {
    dispatch(ControllPanelActions.setDataRelationToEdit(new DataRelationCTO()));
  };

  const selectComponent = (component: ComponentCTO | undefined) => {
    dispatch(ControllPanelActions.setComponentToEdit(component || null));
  };

  const selectData = (data: DataCTO | undefined) => {
    dispatch(ControllPanelActions.setDataToEdit(data || null));
  };

  const selectDataRelation = (dataRelation: DataRelationCTO | undefined) => {
    dispatch(ControllPanelActions.setDataRelationToEdit(dataRelation || null));
  };

  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <ControllPanelFileOptions />
      </div>
      <div className="optionFieldSpacer">
        <div className="columnDivider">
          <OptionField label="component">
            <Button.Group>
              <Button
                icon="add"
                inverted
                color="orange"
                onClick={createNewComponent}
              />
              <Button id="buttonGroupLabel" disabled inverted color="orange">
                Component
              </Button>
              {useGetComponentDropdown(selectComponent, "wrench")}
            </Button.Group>
          </OptionField>
        </div>
      </div>
      <div className="optionFieldSpacer">
        <div className="columnDivider">
          <OptionField label="Data">
            <Button.Group>
              <Button
                icon="add"
                inverted
                color="orange"
                onClick={createNewData}
              />
              <Button id="buttonGroupLabel" disabled inverted color="orange">
                Data
              </Button>
              {useGetDataDropdown(selectData, "wrench")}
            </Button.Group>
            <Button.Group>
              <Button
                icon="add"
                inverted
                color="orange"
                onClick={createNewRelation}
              />
              <Button id="buttonGroupLabel" disabled inverted color="orange">
                Relation
              </Button>
              {useGetRelationDropdown(selectDataRelation, "wrench")}
            </Button.Group>
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
