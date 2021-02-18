import React, { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { GroupTO } from "../../../../../../dataAccess/access/to/GroupTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { EditGroup } from "../../../../../../slices/thunks/GroupThunks";
import { DavitUtil } from "../../../../../../utils/DavitUtil";
import { DavitButton } from "../../../../../common/fragments/buttons/DavitButton";
import { DavitDeleteButton } from "../../../../../common/fragments/buttons/DavitDeleteButton";
import { ColorDropDown } from "../../../../../common/fragments/dropdowns/ColorDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { DavitLabelTextfield } from "../common/fragments/DavitLabelTextfield";

export interface ControllPanelEditGroupProps {
    hidden: boolean;
}

export const ControllPanelEditGroup: FunctionComponent<ControllPanelEditGroupProps> = (props) => {
    const { hidden } = props;
    const {
        label,
        name,
        textInput,
        changeName,
        saveGroup,
        deleteGroup,
        getGroupColor,
        setGroupColor,
        createAnother,
        updateGroup,
        id,
    } = useControllPanelEditGroupViewModel();

    return (
        <ControllPanelEditSub key={id} label={label} hidden={hidden} onClickNavItem={saveGroup}>
            <div className="controllPanelEditChild">
                <ColorDropDown
                    onSelect={setGroupColor}
                    placeholder={getGroupColor()}
                    colors={["red", "blue", "green"]}
                />
            </div>
            <div className="columnDivider controllPanelEditChild">
                <DavitLabelTextfield
                    label="Name:"
                    placeholder="Group Name ..."
                    onChangeDebounced={(name: string) => changeName(name)}
                    value={name}
                    autoFocus
                    ref={textInput}
                    onBlur={() => updateGroup()}
                    unvisible={hidden}
                />
            </div>
            <div className="columnDivider controllPanelEditChild">
                <DavitButton onClick={createAnother} label="Create another" />
                <DavitButton onClick={saveGroup} label="OK" />
            </div>
            <div className="columnDivider controllPanelEditChild">
                <DavitDeleteButton onClick={deleteGroup} />
            </div>
        </ControllPanelEditSub>
    );
};

const useControllPanelEditGroupViewModel = () => {
    const groupToEdit: GroupTO | null = useSelector(editSelectors.selectGroupToEdit);
    const dispatch = useDispatch();
    const textInput = useRef<Input>(null);

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(groupToEdit)) {
            handleError("Tried to go to edit group without groupToEdit specified");
            dispatch(EditActions.setMode.edit());
        }
        // used to focus the textfield on create another
        textInput.current!.focus();
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
        if (!isNullOrUndefined(groupToEdit)) {
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
        textInput,
        getGroupColor,
        setGroupColor,
        createAnother,
        updateGroup,
        id: groupToEdit?.id || -1,
    };
};
