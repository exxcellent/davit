import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GroupTO } from "../../../../../../dataAccess/access/to/GroupTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../slices/GlobalSlice";
import { EditGroup } from "../../../../../../slices/thunks/GroupThunks";
import { DavitUtil } from "../../../../../../utils/DavitUtil";
import { DavitButton } from "../../../../../common/fragments/buttons/DavitButton";
import { DavitDeleteButton } from "../../../../../common/fragments/buttons/DavitDeleteButton";
import { DavitLabelTextfield } from "../../../../../common/fragments/DavitLabelTextfield";
import { ColorDropDown } from "../../../../../common/fragments/dropdowns/ColorDropDown";
import { ControlPanel } from "../common/ControlPanel";
import { OptionField } from "../common/OptionField";

export interface ControlPanelEditGroupProps {
}

export const ControlPanelEditGroup: FunctionComponent<ControlPanelEditGroupProps> = () => {

    const {
        name,
        changeName,
        saveGroup,
        deleteGroup,
        getGroupColor,
        setGroupColor,
        createAnother,
        updateGroup,
    } = useControlPanelEditGroupViewModel();

    return (
        <ControlPanel>

            <OptionField>
                <ColorDropDown
                    onSelect={setGroupColor}
                    placeholder={getGroupColor()}
                    colors={["red", "blue", "green"]}
                />
            </OptionField>

            <OptionField divider={true}>
                <DavitLabelTextfield
                    label="Name:"
                    placeholder="Group Name ..."
                    onChangeCallback={(name: string) => changeName(name)}
                    value={name}
                    focus={true}
                    onBlur={() => updateGroup()}
                />
            </OptionField>

            <OptionField divider={true}>
                <DavitButton onClick={createAnother}
                             label="Create another"
                />
                <DavitButton onClick={saveGroup}
                             label="OK"
                />
            </OptionField>

            <OptionField divider={true}>
                <DavitDeleteButton onClick={deleteGroup} />
            </OptionField>

        </ControlPanel>
    );
};

const useControlPanelEditGroupViewModel = () => {
    const groupToEdit: GroupTO | null = useSelector(editSelectors.selectGroupToEdit);
    const dispatch = useDispatch();

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(groupToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit group without groupToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }

    }, [groupToEdit, dispatch]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(groupToEdit)) {
            const copyGroupToEdit: GroupTO = DavitUtil.deepCopy(groupToEdit);
            copyGroupToEdit.name = name;
            dispatch(EditActions.setMode.editGroup(copyGroupToEdit));
        }
    };

    const updateGroup = () => {
        const copyGroup: GroupTO = DavitUtil.deepCopy(groupToEdit);
        dispatch(EditGroup.save(copyGroup));
    };

    const saveGroup = () => {
        dispatch(EditGroup.save(groupToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const deleteGroup = () => {
        dispatch(EditGroup.delete(groupToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editGroup());
    };

    const getGroupColor = (): string => {
        if (!DavitUtil.isNullOrUndefined(groupToEdit)) {
            return groupToEdit!.color;
        } else {
            return "";
        }
    };

    const setGroupColor = (color: string | undefined) => {
        if (!DavitUtil.isNullOrUndefined(groupToEdit)) {
            const copyGroupToEdit: GroupTO = DavitUtil.deepCopy(groupToEdit);
            if (color !== undefined) {
                copyGroupToEdit.color = color;
            }
            dispatch(EditActions.setMode.editGroup(copyGroupToEdit));
        }
    };

    return {
        label: "EDIT GROUP",
        name: groupToEdit?.name,
        changeName,
        saveGroup,
        deleteGroup,
        getGroupColor,
        setGroupColor,
        createAnother,
        updateGroup,
        id: groupToEdit?.id || -1,
    };
};
