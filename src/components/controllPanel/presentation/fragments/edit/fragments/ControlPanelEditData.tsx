import React, {FunctionComponent, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "semantic-ui-react";
import {DataCTO} from "../../../../../../dataAccess/access/cto/DataCTO";
import {EditActions, editSelectors} from "../../../../../../slices/EditSlice";
import {handleError} from "../../../../../../slices/GlobalSlice";
import {EditData} from "../../../../../../slices/thunks/DataThunks";
import {DavitUtil} from "../../../../../../utils/DavitUtil";
import {DavitBackButton} from "../../../../../common/fragments/buttons/DavitBackButton";
import {DavitButton} from "../../../../../common/fragments/buttons/DavitButton";
import {DavitDeleteButton} from "../../../../../common/fragments/buttons/DavitDeleteButton";
import {DavitLabelTextfield} from "../../../../../common/fragments/DavitLabelTextfield";
import {DataInstanceDropDownButton} from "../../../../../common/fragments/dropdowns/DataInstanceDropDown";
import {ControlPanelEditSub} from "../common/ControlPanelEditSub";
import {OptionField} from "../common/OptionField";
import {DavitCommentButton} from "../../../../../common/fragments/buttons/DavitCommentButton";

export interface ControlPanelEditDataProps {
    hidden: boolean;
}

export const ControlPanelEditData: FunctionComponent<ControlPanelEditDataProps> = (props) => {
    const {hidden} = props;

    const {
        label,
        changeName,
        deleteData,
        name,
        saveData,
        updateData,
        createAnother,
        instances,
        editOrAddInstance,
        id,
        note,
        saveNote,
    } = useControlPanelEditDataViewModel();

    return (
        <ControlPanelEditSub key={id} label={label} hidden={hidden} onClickNavItem={saveData}>
            <div className="optionFieldSpacer">
                <OptionField label="Data - Name">
                    <DavitLabelTextfield
                        label="Name:"
                        placeholder="Data Name"
                        onChangeDebounced={changeName}
                        value={name}
                        focus={true}
                        onBlur={updateData}
                    />
                </OptionField>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <OptionField label="create / edit | Data - Instance">
                    <Button.Group>
                        <Button icon="add" inverted color="orange" onClick={() => editOrAddInstance()}/>
                        <Button id="buttonGroupLabel" disabled inverted color="orange">
                            Instance
                        </Button>
                        <DataInstanceDropDownButton
                            onSelect={(id) => editOrAddInstance(id)}
                            icon={"wrench"}
                            instances={instances}
                        />
                    </Button.Group>
                </OptionField>
            </div>
            <div className="columnDivider controllPanelEditChild">
                <OptionField>
                    <DavitCommentButton onSaveCallback={saveNote} comment={note}/>
                </OptionField>
            </div>
            <div className="columnDivider controllPanelEditChild">
                <div className="optionFieldSpacer">
                    <OptionField label="Navigation">
                        <DavitButton onClick={createAnother} label="Create another"/>
                        <DavitBackButton onClick={saveData}/>
                    </OptionField>
                </div>
                <div className="optionFieldSpacer">
                    <OptionField label="Sequence - Options">
                        <DavitDeleteButton onClick={deleteData}/>
                    </OptionField>
                </div>
            </div>
        </ControlPanelEditSub>
    );
};

const useControlPanelEditDataViewModel = () => {
    const dataToEdit: DataCTO | null = useSelector(editSelectors.selectDataToEdit);
    const dispatch = useDispatch();

    useEffect(() => {
        // check if component to edit is really set or gso back to edit mode
        if (dataToEdit === null || dataToEdit === undefined) {
            handleError("Tried to go to edit data without dataToedit specified");
            dispatch(EditActions.setMode.edit());
        }
    });

    const changeName = (name: string) => {
        const copyDataToEdit: DataCTO = DavitUtil.deepCopy(dataToEdit);
        copyDataToEdit.data.name = name;
        dispatch(EditActions.setMode.editData(copyDataToEdit));
    };

    const updateData = () => {
        const copyDataToEdit: DataCTO = DavitUtil.deepCopy(dataToEdit);
        dispatch(EditData.save(copyDataToEdit));
    };

    const saveData = () => {
        if (dataToEdit?.data.name !== "") {
            dispatch(EditData.save(dataToEdit!));
        } else {
            deleteData();
        }
        dispatch(EditActions.setMode.edit());
    };

    const deleteData = () => {
        dispatch(EditData.delete(dataToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editData());
    };

    const editOrAddInstance = (id?: number) => {
        if (dataToEdit !== null) {
            dispatch(EditActions.setMode.editDataInstance(id));
        }
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(dataToEdit) && text !== "") {
            const copyDataToEdit: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyDataToEdit.data.note = text;
            dispatch(EditActions.setMode.editData(copyDataToEdit));
        }
    };

    return {
        label: "EDIT * " + (dataToEdit?.data.name || ""),
        name: dataToEdit?.data.name,
        changeName,
        saveData,
        deleteData,
        updateData,
        createAnother,
        instances: dataToEdit?.data.instances ? dataToEdit.data.instances : [],
        editOrAddInstance,
        id: dataToEdit?.data.id || -1,
        note: dataToEdit ? dataToEdit.data.note : "",
        saveNote,
    };
};
