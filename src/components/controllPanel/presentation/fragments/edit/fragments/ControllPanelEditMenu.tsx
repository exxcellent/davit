import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { DataSetupTO } from "../../../../../../dataAccess/access/to/DataSetupTO";
import { GroupTO } from "../../../../../../dataAccess/access/to/GroupTO";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { DataDropDown } from "../../../../../common/fragments/dropdowns/DataDropDown";
import { DataSetupDropDown } from "../../../../../common/fragments/dropdowns/DataSetupDropDown";
import { GroupDropDown } from "../../../../../common/fragments/dropdowns/GroupDropDown";
import { RelationDropDown } from "../../../../../common/fragments/dropdowns/RelationDropDown";
import { SequenceDropDown } from "../../../../../common/fragments/dropdowns/SequenceDropDown";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditMenuProps {
  editOrAddComponent: (component?: ComponentCTO) => void;
  editOrAddData: (data?: DataCTO) => void;
  editOrAddRelation: (relation?: DataRelationCTO) => void;
  editOrAddSequence: (sequence?: SequenceCTO) => void;
  editOrAddGroup: (group?: GroupTO) => void;
  editOrAddDataSetup: (dataSetup?: DataSetupTO) => void;
}

export const ControllPanelEditMenu: FunctionComponent<ControllPanelEditMenuProps> = (props) => {
  const {
    editOrAddComponent,
    editOrAddData,
    editOrAddRelation,
    editOrAddSequence,
    editOrAddGroup,
    editOrAddDataSetup,
  } = props;

  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <OptionField label="component">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddComponent()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Component
            </Button>
            <ComponentDropDown onSelect={editOrAddComponent} icon="wrench" />
          </Button.Group>
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddGroup()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Group
            </Button>
            <GroupDropDown onSelect={editOrAddGroup} icon="wrench" />
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
            <DataDropDown onSelect={editOrAddData} icon={"wrench"} />
          </Button.Group>
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddRelation()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Relation
            </Button>
            <RelationDropDown onSelect={editOrAddRelation} icon={"wrench"} />
          </Button.Group>
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="Data - Setup">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddDataSetup()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Data Setup
            </Button>
            <DataSetupDropDown onSelect={editOrAddDataSetup} icon={"wrench"} />
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
            <SequenceDropDown onSelect={editOrAddSequence} icon="wrench" />
          </Button.Group>
        </OptionField>
      </div>
    </div>
  );
};
