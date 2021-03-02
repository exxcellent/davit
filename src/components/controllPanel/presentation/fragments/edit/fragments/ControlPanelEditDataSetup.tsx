import React, {FunctionComponent, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ActorCTO} from '../../../../../../dataAccess/access/cto/ActorCTO';
import {DataSetupCTO} from '../../../../../../dataAccess/access/cto/DataSetupCTO';
import {InitDataTO} from '../../../../../../dataAccess/access/to/InitDataTO';
import {EditActions, editSelectors} from '../../../../../../slices/EditSlice';
import {EditDataSetup} from '../../../../../../slices/thunks/DataSetupThunks';
import {DavitUtil} from '../../../../../../utils/DavitUtil';
import {DavitBackButton} from '../../../../../common/fragments/buttons/DavitBackButton';
import {DavitButton} from '../../../../../common/fragments/buttons/DavitButton';
import {DavitDeleteButton} from '../../../../../common/fragments/buttons/DavitDeleteButton';
import {DavitLabelTextfield} from '../../../../../common/fragments/DavitLabelTextfield';
import {InitDataDropDownButton} from '../../../../../common/fragments/dropdowns/InitDataDropDown';
import {OptionField} from '../common/OptionField';
import {DavitCommentButton} from '../../../../../common/fragments/buttons/DavitCommentButton';
import {AddOrEdit} from '../../../../../common/fragments/AddOrEdit';
import {GlobalActions} from "../../../../../../slices/GlobalSlice";

export interface ControlPanelEditDataSetupProps {
    hidden: boolean;
}

export const ControlPanelEditDataSetup: FunctionComponent<ControlPanelEditDataSetupProps> = () => {

    const {
        name,
        changeName,
        saveDataSetup,
        deleteDataSetup,
        getInitDatas,
        createAnother,
        updateDataSetup,
        editInitData,
        createInitData,
        note,
        saveNote,
    } = useControlPanelEditDataSetupViewModel();

    return (
        <div className='headerGrid'>
            <OptionField label='Data - SETUP NAME'>
                <DavitLabelTextfield
                    label='Name:'
                    placeholder='Data Setup Name ...'
                    onChangeDebounced={(name: string) => changeName(name)}
                    value={name}
                    focus={true}
                    onBlur={updateDataSetup}
                />
            </OptionField>
            <OptionField label='Create / edit | Init - Data' divider={true}>
                <AddOrEdit addCallBack={createInitData} label={'Data'}
                           dropDown={<InitDataDropDownButton onSelect={editInitData} icon='wrench'
                                                             initDatas={getInitDatas}/>}/>
            </OptionField>
            <OptionField label={"Note"} divider={true}>
                <DavitCommentButton onSaveCallback={saveNote} comment={note}/>
            </OptionField>

            <OptionField label='Options' divider={true}>
                <DavitButton onClick={createAnother} label='Create another'/>
                <DavitBackButton onClick={saveDataSetup}/>
                <DavitDeleteButton onClick={deleteDataSetup}/>
            </OptionField>
        </div>
    );
};

const useControlPanelEditDataSetupViewModel = () => {
    const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.selectDataSetupToEdit);
    const dispatch = useDispatch();
    const [actorToEdit, setActorToEdit] = useState<ActorCTO | null>(null);

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(dataSetupToEdit)) {
            dispatch(GlobalActions.handleError('Tried to go to edit dataSetup without dataSetupToedit specified'));
            dispatch(EditActions.setMode.edit());
        }
    }, [dataSetupToEdit, dispatch]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(dataSetupToEdit)) {
            const copyDataSetupToEdit: DataSetupCTO = DavitUtil.deepCopy(dataSetupToEdit);
            copyDataSetupToEdit.dataSetup.name = name;
            dispatch(EditDataSetup.update(copyDataSetupToEdit));
        }
    };

    const saveDataSetup = () => {
        if (dataSetupToEdit?.dataSetup.name !== '') {
            dispatch(EditDataSetup.save(dataSetupToEdit!));
        } else {
            deleteDataSetup();
        }
        dispatch(EditActions.setMode.edit());
    };

    const deleteDataSetup = () => {
        dispatch(EditDataSetup.delete(dataSetupToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editDataSetup());
    };

    const updateDataSetup = () => {
        const copyDataSetup: DataSetupCTO = DavitUtil.deepCopy(dataSetupToEdit);
        dispatch(EditDataSetup.save(copyDataSetup));
    };

    const copyDataSetup = () => {
        const copyDataSetup: DataSetupCTO = DavitUtil.deepCopy(dataSetupToEdit);
        copyDataSetup.dataSetup.name = dataSetupToEdit?.dataSetup.name + '-copy';
        copyDataSetup.dataSetup.id = -1;
        copyDataSetup.initDatas.forEach((initData) => {
            initData.id = -1;
            initData.dataSetupFk = -1;
        });
        dispatch(EditActions.setMode.editDataSetup(copyDataSetup.dataSetup.id));
    };

    const getDatas = (): number[] => {
        const dataIds: number[] = [];
        if (!DavitUtil.isNullOrUndefined(dataSetupToEdit) && !DavitUtil.isNullOrUndefined(actorToEdit)) {
            dataSetupToEdit!.initDatas
                .filter((initData) => initData.actorFk === actorToEdit!.actor.id)
                .forEach((initData) => dataIds.push(initData.dataFk));
        }
        return dataIds;
    };

    const editInitData = (initData: InitDataTO | undefined) => {
        if (initData) {
            dispatch(EditActions.setMode.editInitData(initData));
        }
    };

    const createInitData = () => {
        if (!DavitUtil.isNullOrUndefined(dataSetupToEdit)) {
            const initData: InitDataTO = new InitDataTO();
            initData.dataSetupFk = dataSetupToEdit!.dataSetup.id;
            editInitData(initData);
        }
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(dataSetupToEdit) && text !== '') {
            const copyDataSetupToEdit: DataSetupCTO = DavitUtil.deepCopy(dataSetupToEdit);
            copyDataSetupToEdit.dataSetup.note = text;
            dispatch(EditDataSetup.update(copyDataSetupToEdit));
        }
    };

    return {
        label: 'EDIT * ' + (dataSetupToEdit?.dataSetup.name || ''),
        name: dataSetupToEdit?.dataSetup.name,
        changeName,
        saveDataSetup,
        deleteDataSetup,
        copyDataSetup,
        setActorToEdit,
        getInitDatas: dataSetupToEdit?.initDatas ? dataSetupToEdit.initDatas : [],
        getDatas,
        createAnother,
        updateDataSetup,
        editInitData,
        createInitData,
        note: dataSetupToEdit ? dataSetupToEdit.dataSetup.note : '',
        saveNote,
    };
};
