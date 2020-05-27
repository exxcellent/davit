import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";
import { useControllPanelEditViewModel } from "../../../viewModel/ControllPanelEditViewModel";
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

export const ControllPanelEdit: FunctionComponent<ControllPanelEditProps> = (props) => {
  const {
    createComponent,
    createData,
    createRelation,
    createSequence,
    selectComponent,
    selectData,
    selectRelation,
    selectSequence,
  } = useControllPanelEditViewModel();

  // useEffect(() => {
  //   dispatch(ControllPanelActions.findAllSequences());
  // }, [dispatch]);

  // const createNewData = () => {
  //   dispatch(ControllPanelActions.setDataToEdit(new DataCTO()));
  // };

  // const createNewRelation = () => {
  //   dispatch(ControllPanelActions.setDataRelationToEdit(new DataRelationCTO()));
  // };

  // const createNewSequence = () => {
  //   dispatch(ControllPanelActions.setSequenceToEdit(new SequenceCTO()));
  // };

  // const selectComponent = (component: ComponentCTO | undefined) => {
  //   dispatch(ControllPanelActions.setComponentToEdit(component || null));
  // };

  // const selectData = (data: DataCTO | undefined) => {
  //   dispatch(ControllPanelActions.setDataToEdit(data || null));
  // };

  // const selectSequence = (sequence: SequenceCTO | undefined) => {
  //   dispatch(ControllPanelActions.setSequenceToEdit(sequence || null));
  //   dispatch(ControllPanelActions.setMode(Mode.EDIT_SEQUENCE));
  // };

  // const selectDataRelation = (dataRelation: DataRelationCTO | undefined) => {
  //   dispatch(ControllPanelActions.setDataRelationToEdit(dataRelation || null));
  // };

  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <ControllPanelFileOptions />
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="component">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={createComponent} />
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
            <Button icon="add" inverted color="orange" onClick={createData} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Data
            </Button>
            {useGetDataDropdown(selectData, "wrench")}
          </Button.Group>
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={createRelation} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Relation
            </Button>
            {useGetRelationDropdown(selectRelation, "wrench")}
          </Button.Group>
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="sequence">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={createSequence} />
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
