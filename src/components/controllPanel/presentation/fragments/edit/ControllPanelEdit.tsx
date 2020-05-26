import React, { FunctionComponent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import {
  useGetComponentDropdown,
  useGetDataDropdown,
  useGetRelationDropdown,
  useGetSequenceDropdown,
} from "./common/fragments/Carv2DropDown";
import { OptionField } from "./common/OptionField";
import "./ControllPanelEdit.css";
import { ControllPanelFileOptions } from "./ControllPanelFileOptions";

export interface ControllPanelEditProps {}

export const ControllPanelEdit: FunctionComponent<ControllPanelEditProps> = (
  props
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ControllPanelActions.findAllSequences());
  }, [dispatch]);

  const createNewComponent = () => {
    dispatch(ControllPanelActions.setComponentToEdit(new ComponentCTO()));
  };

  const createNewData = () => {
    dispatch(ControllPanelActions.setDataToEdit(new DataCTO()));
  };

  const createNewRelation = () => {
    dispatch(ControllPanelActions.setDataRelationToEdit(new DataRelationCTO()));
  };

  const createNewSequence = () => {
    dispatch(ControllPanelActions.setSequenceToEdit(new SequenceCTO()));
  };

  const selectComponent = (component: ComponentCTO | undefined) => {
    dispatch(ControllPanelActions.setComponentToEdit(component || null));
  };

  const selectData = (data: DataCTO | undefined) => {
    dispatch(ControllPanelActions.setDataToEdit(data || null));
  };

  const selectSequence = (sequence: SequenceCTO | undefined) => {
    dispatch(ControllPanelActions.setSequenceToEdit(sequence || null));
  };

  const selectDataRelation = (dataRelation: DataRelationCTO | undefined) => {
    dispatch(ControllPanelActions.setDataRelationToEdit(dataRelation || null));
  };

  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <ControllPanelFileOptions />
      </div>
      <div className="optionFieldSpacer columnDivider">
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
      <div className="optionFieldSpacer columnDivider">
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
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="sequence">
          <Button.Group>
            <Button
              icon="add"
              inverted
              color="orange"
              onClick={createNewSequence}
            />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Sequence
            </Button>
            {useGetSequenceDropdown(selectSequence, "wrench")}
          </Button.Group>
        </OptionField>
      </div>
    </div>
  );
};
