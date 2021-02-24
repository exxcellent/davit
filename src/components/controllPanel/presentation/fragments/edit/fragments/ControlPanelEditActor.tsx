import React, {FunctionComponent, useEffect} from "react";
import {DavitBackButton} from "../../../../../common/fragments/buttons/DavitBackButton";
import {DavitButton} from "../../../../../common/fragments/buttons/DavitButton";
import {DavitDeleteButton} from "../../../../../common/fragments/buttons/DavitDeleteButton";
import {DavitLabelTextfield} from "../../../../../common/fragments/DavitLabelTextfield";
import {ControlPanelEditSub} from "../common/ControlPanelEditSub";
import {OptionField} from "../common/OptionField";
import {DavitCommentButton} from "../../../../../common/fragments/buttons/DavitCommentButton";
import {DavitUtil} from "../../../../../../utils/DavitUtil";
import {ActorCTO} from "../../../../../../dataAccess/access/cto/ActorCTO";
import {EditActor} from "../../../../../../slices/thunks/ActorThunks";
import {EditActions, editSelectors} from "../../../../../../slices/EditSlice";
import {useDispatch, useSelector} from "react-redux";
import {GroupTO} from "../../../../../../dataAccess/access/to/GroupTO";
import {handleError} from "../../../../../../slices/GlobalSlice";

export interface ControlPanelEditActorProps {
    hidden: boolean;
}

export const ControlPanelEditActor: FunctionComponent<ControlPanelEditActorProps> = (props) => {
    const {hidden} = props;

    const {
        label,
        name,
        changeName,
        saveActor,
        deleteComponent,
        updateActor,
        createAnother,
        id,
        note,
        saveNote,
    } = useControlPanelEditActorViewModel();

    return (
        <ControlPanelEditSub key={id} label={label} hidden={hidden} onClickNavItem={saveActor}>
            <div className="optionFieldSpacer">
                <OptionField label="Component - Name">
                    <DavitLabelTextfield
                        label="Name:"
                        placeholder="Component Name"
                        onChangeDebounced={(name: string) => changeName(name)}
                        onBlur={updateActor}
                        value={name}
                        focus
                    />
                </OptionField>
            </div>
            <div className="columnDivider">
                <OptionField>
                    <DavitCommentButton onSaveCallback={saveNote} comment={note}/>
                </OptionField>
            </div>
            <div className="columnDivider controllPanelEditChild">
                <div>
                    <OptionField label="Navigation">
                        <DavitButton onClick={createAnother} label="Create another"/>
                        <DavitBackButton onClick={saveActor}/>
                    </OptionField>
                </div>
            </div>
            <div className="optionFieldSpacer columnDivider">
                <OptionField label="Component - Options">
                    <DavitDeleteButton onClick={deleteComponent}/>
                </OptionField>
            </div>
        </ControlPanelEditSub>
    );
};

const useControlPanelEditActorViewModel = () => {
    const actorToEdit: ActorCTO | null = useSelector(editSelectors.selectActorToEdit);
    const dispatch = useDispatch();


    useEffect(() => {
// check if component to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(actorToEdit)) {
            handleError("Tried to go to edit component without component To edit specified");
            EditActions.setMode.edit();
        }
    }, [actorToEdit]);

    const changeName = (name: string) => {
        const copyActorToEdit: ActorCTO = DavitUtil.deepCopy(actorToEdit);
        copyActorToEdit.actor.name = name;
        dispatch(EditActions.setMode.editActor(copyActorToEdit));
    };

    const updateActor = () => {
        const copyActorToEdit: ActorCTO = DavitUtil.deepCopy(actorToEdit);
        dispatch(EditActor.save(copyActorToEdit));
    };

    const saveActor = () => {
        if (!DavitUtil.isNullOrUndefined(actorToEdit)) {
            if (actorToEdit?.actor.name !== "") {
                dispatch(EditActor.save(actorToEdit!));
            } else {
                deleteActor();
            }
            dispatch(EditActions.setMode.edit());
        }
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editActor());
    };

    const deleteActor = () => {
        dispatch(EditActor.delete(actorToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const setGroup = (group: GroupTO | undefined) => {
        if (!DavitUtil.isNullOrUndefined(actorToEdit)) {
            const copyComponentToEdit: ActorCTO = DavitUtil.deepCopy(actorToEdit);
            if (group !== undefined) {
                copyComponentToEdit.actor.groupFks = group.id;
            } else {
                copyComponentToEdit.actor.groupFks = -1;
            }
            dispatch(EditActions.setMode.editActor(copyComponentToEdit));
        }
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(actorToEdit)) {
            const copyActor: ActorCTO = DavitUtil.deepCopy(actorToEdit);
            copyActor.actor.note = text;
            dispatch(EditActions.setMode.editActor(copyActor));
        }
    };

    return {
        label: "EDIT * " + (actorToEdit?.actor.name || ""),
        name: actorToEdit?.actor.name,
        changeName,
        saveActor: saveActor,
        deleteComponent: deleteActor,
        setGroup,
        compGroup: actorToEdit?.actor.groupFks !== -1 ? actorToEdit?.actor.groupFks : undefined,
        updateActor,
        createAnother,
        id: actorToEdit?.actor.id || -1,
        note: actorToEdit ? actorToEdit.actor.note : "",
        saveNote,
    };
};
