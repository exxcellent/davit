import React, { FunctionComponent } from 'react';
import { ActorCTO } from '../../../../../../dataAccess/access/cto/ActorCTO';
import { DataCTO } from '../../../../../../dataAccess/access/cto/DataCTO';
import { ChainTO } from '../../../../../../dataAccess/access/to/ChainTO';
import { DataRelationTO } from '../../../../../../dataAccess/access/to/DataRelationTO';
import { DataSetupTO } from '../../../../../../dataAccess/access/to/DataSetupTO';
import { GroupTO } from '../../../../../../dataAccess/access/to/GroupTO';
import { ActorDropDownButton } from '../../../../../common/fragments/dropdowns/ActorDropDown';
import { DataDropDownButton } from '../../../../../common/fragments/dropdowns/DataDropDown';
import { DataSetupDropDownButton } from '../../../../../common/fragments/dropdowns/DataSetupDropDown';
import { RelationDropDownButton } from '../../../../../common/fragments/dropdowns/RelationDropDown';
import { SequenceDropDownButton } from '../../../../../common/fragments/dropdowns/SequenceDropDown';
import { ControlPanelEditSub } from '../common/ControlPanelEditSub';
import { OptionField } from '../common/OptionField';
import { AddOrEdit } from '../../../../../common/fragments/AddOrEdit';


export interface ControlPanelEditMenuProps {
    editOrAddActor: (actor?: ActorCTO) => void;
    editOrAddData: (data?: DataCTO) => void;
    editOrAddRelation: (relation?: DataRelationTO) => void;
    editOrAddSequence: (sequenceId?: number) => void;
    editOrAddGroup: (group?: GroupTO) => void;
    editOrAddDataSetup: (dataSetup?: DataSetupTO) => void;
    editOrAddChain: (chain?: ChainTO) => void;
    hidden: boolean;
}

export const ControlPanelEditMenu: FunctionComponent<ControlPanelEditMenuProps> = (props) => {
    const { hidden } = props;

    const {
        editOrAddActor,
        editOrAddData,
        editOrAddRelation,
        editOrAddSequence,
        // editOrAddGroup,
        editOrAddDataSetup,
        editOrAddChain,
    } = props;

    return (
        <ControlPanelEditSub
            label='EDIT'
            hidden={hidden}
            onClickNavItem={() => {
                return;
            }}>
            <div className='optionFieldSpacer'>
                <OptionField label='actor'>
                    <AddOrEdit label={'Actor'} addCallBack={() => editOrAddActor()}
                               dropDown={<ActorDropDownButton onSelect={editOrAddActor} icon='wrench' />} />
                </OptionField>
            </div>
            <div className='optionFieldSpacer columnDivider'>
                <OptionField label='Data'>
                    <AddOrEdit label={'Data'} addCallBack={() => editOrAddData()}
                               dropDown={<DataDropDownButton onSelect={editOrAddData} icon='wrench' />} />
                    <AddOrEdit label={'Relation'} addCallBack={() => editOrAddRelation()}
                               dropDown={<RelationDropDownButton onSelect={editOrAddRelation} icon='wrench' />} />
                </OptionField>
            </div>
            <div className='optionFieldSpacer columnDivider'>
                <OptionField label='Data - Setup'>
                    <AddOrEdit label={'Data Setup'} addCallBack={() => editOrAddDataSetup()}
                               dropDown={<DataSetupDropDownButton onSelect={editOrAddDataSetup} icon='wrench' />} />
                </OptionField>
            </div>
            <div className='optionFieldSpacer columnDivider'>
                <OptionField label='sequence'>
                    <AddOrEdit label={'Sequence'} addCallBack={() => editOrAddSequence()}
                               dropDown={<SequenceDropDownButton
                                   onSelect={(sequenceTO) => editOrAddSequence(sequenceTO?.id)} icon='wrench' />} />
                    <AddOrEdit label={'Chain'} addCallBack={() => editOrAddChain()}
                               dropDown={<SequenceDropDownButton onSelect={(chain) => editOrAddChain(chain)}
                                                                 icon='wrench' />} />
                </OptionField>
            </div>
        </ControlPanelEditSub>
    );
};
