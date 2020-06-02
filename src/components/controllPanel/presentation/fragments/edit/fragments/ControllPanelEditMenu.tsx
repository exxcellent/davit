import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import {
  useGetComponentDropdown,
  useGetDataDropdown,
  useGetRelationDropdown,
  useGetSequenceDropdown,
} from "../common/fragments/Carv2DropDown";
import { OptionField } from "../common/OptionField";
import { ControllPanelFileOptions } from "../ControllPanelFileOptions";

export interface ControllPanelEditMenuProps {
  editOrAddComponent: (component?: ComponentCTO) => void;
  editOrAddData: (data?: DataCTO) => void;
  editOrAddRelation: (relation?: DataRelationCTO) => void;
  editOrAddSequence: (sequence?: SequenceCTO) => void;
}

export const ControllPanelEditMenu: FunctionComponent<ControllPanelEditMenuProps> = (props) => {
  const { editOrAddComponent, editOrAddData, editOrAddRelation, editOrAddSequence } = props;

  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <ControllPanelFileOptions />
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="component">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddComponent()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Component
            </Button>
            {useGetComponentDropdown(editOrAddComponent, "wrench")}
          </Button.Group>
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="Data">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddData()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Data
            </Button>
            {useGetDataDropdown(editOrAddData, "wrench")}
          </Button.Group>
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddRelation()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Relation
            </Button>
            {useGetRelationDropdown(editOrAddRelation, "wrench")}
          </Button.Group>
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="sequence">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddSequence()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Sequence
            </Button>
            {useGetSequenceDropdown(editOrAddSequence, "wrench")}
          </Button.Group>
        </OptionField>
      </div>
    </div>
  );
};
