import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationTO } from "../../../../../../dataAccess/access/to/DataRelationTO";
import { DataSetupTO } from "../../../../../../dataAccess/access/to/DataSetupTO";
import { GroupTO } from "../../../../../../dataAccess/access/to/GroupTO";
import { ComponentDropDownButton } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { DataDropDownButton } from "../../../../../common/fragments/dropdowns/DataDropDown";
import { DataSetupDropDownButton } from "../../../../../common/fragments/dropdowns/DataSetupDropDown";
import { RelationDropDownButton } from "../../../../../common/fragments/dropdowns/RelationDropDown";
import { SequenceDropDownButton } from "../../../../../common/fragments/dropdowns/SequenceDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditMenuProps {
  editOrAddComponent: (component?: ComponentCTO) => void;
  editOrAddData: (data?: DataCTO) => void;
  editOrAddRelation: (relation?: DataRelationTO) => void;
  editOrAddSequence: (sequenceId?: number) => void;
  editOrAddGroup: (group?: GroupTO) => void;
  editOrAddDataSetup: (dataSetup?: DataSetupTO) => void;
}

export const ControllPanelEditMenu: FunctionComponent<ControllPanelEditMenuProps> = (props) => {
  const {
    editOrAddComponent,
    editOrAddData,
    editOrAddRelation,
    editOrAddSequence,
    // editOrAddGroup,
    editOrAddDataSetup,
  } = props;

  return (
    <ControllPanelEditSub label="EDIT">
      <div className="optionFieldSpacer">
        <OptionField label1="component">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddComponent()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Component
            </Button>
            <ComponentDropDownButton onSelect={editOrAddComponent} icon="wrench" />
          </Button.Group>
          {/* <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddGroup()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Group
            </Button>
            <GroupDropDownButton onSelect={editOrAddGroup} icon="wrench" />
          </Button.Group> */}
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label1="Data">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddData()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Data
            </Button>
            <DataDropDownButton onSelect={editOrAddData} icon={"wrench"} />
          </Button.Group>
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddRelation()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Relation
            </Button>
            <RelationDropDownButton onSelect={editOrAddRelation} icon={"wrench"} />
          </Button.Group>
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label1="Data - Setup">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddDataSetup()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Data Setup
            </Button>
            <DataSetupDropDownButton onSelect={editOrAddDataSetup} icon={"wrench"} />
          </Button.Group>
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label1="sequence">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={() => editOrAddSequence()} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Sequence
            </Button>
            <SequenceDropDownButton onSelect={(sequenceTO) => editOrAddSequence(sequenceTO?.id)} icon="wrench" />
          </Button.Group>
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};
