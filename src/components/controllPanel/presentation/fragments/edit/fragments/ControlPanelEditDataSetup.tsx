import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActorCTO } from '../../../../../../dataAccess/access/cto/ActorCTO';
import { DataSetupCTO } from '../../../../../../dataAccess/access/cto/DataSetupCTO';
import { InitDataTO } from '../../../../../../dataAccess/access/to/InitDataTO';
import { EditActions, editSelectors } from '../../../../../../slices/EditSlice';
import { handleError } from '../../../../../../slices/GlobalSlice';
import { EditDataSetup } from '../../../../../../slices/thunks/DataSetupThunks';
import { DavitUtil } from '../../../../../../utils/DavitUtil';
import { DavitBackButton } from '../../../../../common/fragments/buttons/DavitBackButton';
import { DavitButton } from '../../../../../common/fragments/buttons/DavitButton';
import { DavitDeleteButton } from '../../../../../common/fragments/buttons/DavitDeleteButton';
import { DavitLabelTextfield } from '../../../../../common/fragments/DavitLabelTextfield';
import { InitDataDropDownButton } from '../../../../../common/fragments/dropdowns/InitDataDropDown';
import { ControlPanelEditSub } from '../common/ControlPanelEditSub';
import { OptionField } from '../common/OptionField';
import { DavitCommentButton } from '../../../../../common/fragments/buttons/DavitCommentButton';
import { AddOrEdit } from '../../../../../common/fragments/AddOrEdit';

export interface ControlPanelEditDataSetupProps {
    hidden: boolean;
}

export const ControlPanelEditDataSetup: FunctionComponent<ControlPanelEditDataSetupProps> = (props) => {
    const { hidden } = props;

    const {
        label,
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
    } = useControllPanelEditDataSetupViewModel();

    return (
        <ControlPanelEditSub label={label} hidden={hidden} onClickNavItem={saveDataSetup}>
            <div className='optionFieldSpacer'>
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
            </div>
            <div className='columnDivider optionFieldSpacer'>
                <OptionField label='Create / edit | Init - Data'>
                    <AddOrEdit addCallBack={createInitData} label={'Data'}
                               dropDown={<InitDataDropDownButton onSelect={editInitData} icon='wrench'
                                                                 initDatas={getInitDatas} />} />
                </OptionField>
            </div>
            <div className='columnDivider controllPanelEditChild'>
                <OptionField>
                    <DavitCommentButton onSaveCallback={saveNote} comment={note} />
                </OptionField>
            </div>

            <div className='columnDivider controllPanelEditChild'>
                <div className='optionFieldSpacer'>
                    <OptionField label='Navigation'>
                        <DavitButton onClick={createAnother} label='Create another' />
                        <DavitBackButton onClick={saveDataSetup} />
                    </OptionField>
                </div>
                <div className='optionFieldSpacer'>
                    <OptionField label='Sequence - Options'>
                        <DavitDeleteButton onClick={deleteDataSetup} />
                    </OptionField>
                </div>
            </div>
        </ControlPanelEditSub>
    );
};

const useControllPanelEditDataSetupViewModel = () => {
    const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.selectDataSetupToEdit);
    const dispatch = useDispatch();
    const [actorToEdit, setActorToEdit] = useState<ActorCTO | null>(null);

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(dataSetupToEdit)) {
            handleError('Tried to go to edit dataSetup without dataSetupToedit specified');
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
