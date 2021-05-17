import React, {FunctionComponent} from 'react';
import {ActorCTO} from '../../../../../../dataAccess/access/cto/ActorCTO';
import {DataCTO} from '../../../../../../dataAccess/access/cto/DataCTO';
import {ChainTO} from '../../../../../../dataAccess/access/to/ChainTO';
import {DataRelationTO} from '../../../../../../dataAccess/access/to/DataRelationTO';
import {DataSetupTO} from '../../../../../../dataAccess/access/to/DataSetupTO';
import {GroupTO} from '../../../../../../dataAccess/access/to/GroupTO';
import {ActorDropDownLabel} from '../../../../../common/fragments/dropdowns/ActorDropDown';
import {DataLabelDropDown} from '../../../../../common/fragments/dropdowns/DataDropDown';
import {DataSetupLabelDropDown} from '../../../../../common/fragments/dropdowns/DataSetupDropDown';
import {RelationLabelDropDown} from '../../../../../common/fragments/dropdowns/RelationDropDown';
import {SequenceLabelDropDown} from '../../../../../common/fragments/dropdowns/SequenceDropDown';
import {OptionField} from '../common/OptionField';
import {AddOrEdit} from '../../../../../common/fragments/AddOrEdit';
import {ChainDropDownButton} from '../../../../../common/fragments/dropdowns/ChainDropDown';
import {useDispatch, useSelector} from "react-redux";
import {EditActions, editSelectors, Mode} from "../../../../../../slices/EditSlice";
import {ControlPanel} from '../common/ControlPanel';


export interface ControlPanelEditMenuProps {
}

export const ControlPanelEditMenu: FunctionComponent<ControlPanelEditMenuProps> = () => {

    const {
        editOrAddActor,
        editOrAddData,
        editOrAddRelation,
        editOrAddSequence,
        editOrAddDataSetup,
        editOrAddChain,
    } = useControlPanelEditMenuViewModel();

    return (
        <ControlPanel>
            <OptionField label='actor'>
                <AddOrEdit label={'Actor'} addCallBack={() => editOrAddActor()}
                           dropDown={<ActorDropDownLabel onSelect={editOrAddActor} label='Actor'/>}/>
            </OptionField>
            <OptionField label='Data' divider={true}>
                <AddOrEdit label={'Data'} addCallBack={() => editOrAddData()}
                           dropDown={<DataLabelDropDown onSelect={editOrAddData} label='Data'/>}/>
                <AddOrEdit label={'Relation'} addCallBack={() => editOrAddRelation()}
                           dropDown={<RelationLabelDropDown onSelect={editOrAddRelation} label='Relation'/>}/>
            </OptionField>
            <OptionField label='Data - Setup' divider={true}>
                <AddOrEdit label={'Data Setup'} addCallBack={() => editOrAddDataSetup()}
                           dropDown={<DataSetupLabelDropDown onSelect={editOrAddDataSetup} label='Data-Setup'/>}/>
            </OptionField>
            <OptionField label='sequence' divider={true}>
                <AddOrEdit label={'Sequence'} addCallBack={() => editOrAddSequence()}
                           dropDown={<SequenceLabelDropDown
                               onSelect={(sequenceTO) => editOrAddSequence(sequenceTO?.id)}
                               label='Sequence'/>}
                />
                <AddOrEdit label={'Chain'} addCallBack={() => editOrAddChain()}
                           dropDown={<ChainDropDownButton
                               onSelect={(chain) => editOrAddChain(chain)}
                               label='Chain'/>}
                />
            </OptionField>
        </ControlPanel>
    );
};

const useControlPanelEditMenuViewModel = () => {
    const dispatch = useDispatch();
    const mode: Mode = useSelector(editSelectors.selectMode);

    return {
        mode,
        editOrAddActor: (actor?: ActorCTO) => dispatch(EditActions.setMode.editActor(actor)),
        editOrAddData: (data?: DataCTO) => dispatch(EditActions.setMode.editData(data)),
        editOrAddRelation: (relation?: DataRelationTO) => dispatch(EditActions.setMode.editRelation(relation)),
        editOrAddSequence: (sequenceId?: number) => dispatch(EditActions.setMode.editSequence(sequenceId)),
        editOrAddGroup: (group?: GroupTO) => dispatch(EditActions.setMode.editGroup(group)),
        editOrAddDataSetup: (dataSetup?: DataSetupTO) =>
            dispatch(EditActions.setMode.editDataSetup(dataSetup ? dataSetup.id : undefined)),
        editOrAddChain: (chain?: ChainTO) => dispatch(EditActions.setMode.editChain(chain)),
    };
};
