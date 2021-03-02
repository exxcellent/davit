import React, {FunctionComponent, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {DataCTO} from "../../../../../../dataAccess/access/cto/DataCTO";
import {DataInstanceTO} from "../../../../../../dataAccess/access/to/DataInstanceTO";
import {EditActions, editSelectors} from "../../../../../../slices/EditSlice";
import {handleError} from "../../../../../../slices/GlobalSlice";
import {EditData} from "../../../../../../slices/thunks/DataThunks";
import {DavitUtil} from "../../../../../../utils/DavitUtil";
import {DavitBackButton} from "../../../../../common/fragments/buttons/DavitBackButton";
import {DavitButton} from "../../../../../common/fragments/buttons/DavitButton";
import {DavitDeleteButton} from "../../../../../common/fragments/buttons/DavitDeleteButton";
import {DavitLabelTextfield} from "../../../../../common/fragments/DavitLabelTextfield";
import {ControlPanelEditSub} from "../common/ControlPanelEditSub";
import {OptionField} from "../common/OptionField";

export interface ControlPanelEditDataInstanceProps {
    hidden: boolean;
}

export const ControlPanelEditDataInstance: FunctionComponent<ControlPanelEditDataInstanceProps> = (props) => {
    const {hidden} = props;
    const {
        label,
        changeName,
        getName,
        goBack,
        deleteDataInstance,
        createAnother,
        key,
        isDeletButtonDisable,
        saveOnBlure,
    } = useControlPanelEditDataInstanceViewModel();

    return (
        <ControlPanelEditSub key={key} label={label} hidden={hidden} onClickNavItem={goBack}>
            <div className="optionFieldSpacer">
                <OptionField label="Instance - Name">
                    <DavitLabelTextfield
                        label="Name:"
                        placeholder="Data Instance Name"
                        onChangeDebounced={(name: string) => changeName(name)}
                        value={getName()}
                        onBlur={saveOnBlure}
                    />
                </OptionField>
            </div>
            <div className="columnDivider controllPanelEditChild"/>
            <div className="columnDivider controllPanelEditChild">
                <div>
                    <OptionField label="Navigation">
                        <DavitButton onClick={createAnother} label="Create another"/>
                        <DavitBackButton onClick={goBack}/>
                    </OptionField>
                </div>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <OptionField label="Data - Options">
                    <DavitDeleteButton onClick={deleteDataInstance} disable={isDeletButtonDisable()}/>
                </OptionField>
            </div>
        </ControlPanelEditSub>
    );
};

const useControlPanelEditDataInstanceViewModel = () => {
    const dataToEdit: DataCTO | null = useSelector(editSelectors.selectDataToEdit);
    const instanceId: number | null = useSelector(editSelectors.selectInstanceIdToEdit);
    const dispatch = useDispatch();

    useEffect(() => {
        // check if component to edit is really set or go back to edit mode
        if (dataToEdit === null && instanceId === -1) {
            handleError("Tried to go to edit data without data to edit specified");
            dispatch(EditActions.setMode.edit());
        }
    });

    const changeName = (name: string) => {
        if (dataToEdit !== null && instanceId !== null) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyData.data.instances.find((inst) => inst.id === instanceId)!.name = name;
            dispatch(EditData.update(copyData));
        }
    };

    const goBack = () => {
        if (dataToEdit !== null && instanceId !== null) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            const instance: DataInstanceTO | undefined = copyData.data.instances.find((inst) => inst.id === instanceId);
            if (instance && instance.name === "") {
                if (instance.id === -1) {
                    deleteDataInstance();
                } else {
                    dispatch(EditActions.setMode.editDataById(dataToEdit.data.id));
                }
            } else {
                dispatch(EditActions.setMode.editDataById(dataToEdit.data.id));
            }
        }
    };

    const saveOnBlure = () => {
        if (dataToEdit !== null && instanceId !== null) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            if (copyData.data.instances.find((inst) => inst.id === instanceId)!.name !== "") {
                dispatch(EditData.save(copyData));
            }
        }
    };

    const deleteDataInstance = () => {
        if (dataToEdit !== null && instanceId !== null) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyData.data.instances = copyData.data.instances.filter((inst) => inst.id !== instanceId);
            dispatch(EditData.save(copyData));
            dispatch(EditActions.setMode.editDataById(dataToEdit.data.id));
        }
    };

    const createAnother = () => {
        if (dataToEdit !== null) {
            dispatch(EditActions.setMode.editDataInstance());
        }
    };

    const getName = (): string => {
        let name: string;
        const instance = dataToEdit?.data.instances.find((inst) => inst.id === instanceId);
        if (instance) {
            name = instance.name;
        } else {
            name = "could not find instance!";
        }
        return name;
    };

    const isDeletButtonDisable = (): boolean => {
        let disable: boolean = true;
        if (!DavitUtil.isNullOrUndefined(dataToEdit)) {
            disable = dataToEdit!.data.instances.length < 2;
        }
        return disable;
    };

    return {
        label: "EDIT * DATA * INSTANCE",
        getName,
        changeName,
        goBack,
        deleteDataInstance,
        createAnother,
        key: instanceId && dataToEdit ? dataToEdit.data.instances.find((inst) => inst.id === instanceId)!.id : -1,
        isDeletButtonDisable,
        saveOnBlure,
    };
};
