import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { ActorCTO } from "../../../../../../dataAccess/access/cto/ActorCTO";
import { GroupTO } from "../../../../../../dataAccess/access/to/GroupTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { EditActor } from "../../../../../../slices/thunks/ActorThunks";
import { DavitUtil } from "../../../../../../utils/DavitUtil";
import { DavitButtonIcon, DavitButtonLabel } from "../../../../../common/fragments/buttons/DavitButton";
import { DavitDeleteButton } from "../../../../../common/fragments/buttons/DavitDeleteButton";
import { DavitModal } from "../../../../../common/fragments/DavitModal";
import { DavitNoteForm } from "../../../../../common/fragments/forms/DavitNoteForm";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { DavitLabelTextfield } from "../common/fragments/DavitLabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditActorProps {
    hidden: boolean;
}

export const ControllPanelEditActor: FunctionComponent<ControllPanelEditActorProps> = (props) => {
    const { hidden } = props;

    const [showNote, setShowNote] = useState<boolean>(false);

    const {
        label,
        name,
        changeName,
        saveActor,
        deleteComponent,
        textInput,
        updateActor,
        createAnother,
        id,
        note,
        saveNote,
    } = useControllPanelEditActorViewModel();

    return (
        <ControllPanelEditSub key={id} label={label} hidden={hidden} onClickNavItem={saveActor}>
            <div className="optionFieldSpacer">
                <OptionField label="Component - Name">
                    <DavitLabelTextfield
                        label="Name:"
                        placeholder="Component Name"
                        onChangeDebounced={(name: string) => changeName(name)}
                        onBlur={updateActor}
                        value={name}
                        autoFocus
                        ref={textInput}
                        unvisible={hidden}
                    />
                </OptionField>
            </div>
            <div className="columnDivider">
                <OptionField>
                    <button onClick={() => setShowNote(true)}>Note</button>
                    {showNote && (
                        <DavitModal
                            content={
                                <DavitNoteForm
                                    text={note}
                                    onSubmit={(text: string) => {
                                        setShowNote(false);
                                        saveNote(text);
                                    }}
                                    onCancel={() => setShowNote(false)}
                                />
                            }
                        />
                    )}
                </OptionField>
            </div>
            <div className="columnDivider controllPanelEditChild">
                <div>
                    <OptionField label="Navigation">
                        <DavitButtonLabel onClick={createAnother} label="Create another" />
                        <DavitButtonIcon onClick={saveActor} icon="reply" />
                    </OptionField>
                </div>
            </div>
            <div className="optionFieldSpacer columnDivider">
                <OptionField label="Component - Options">
                    <DavitDeleteButton onClick={deleteComponent} />
                </OptionField>
            </div>
        </ControllPanelEditSub>
    );
};

const useControllPanelEditActorViewModel = () => {
    const actorToEdit: ActorCTO | null = useSelector(editSelectors.selectActorToEdit);
    const dispatch = useDispatch();
    const textInput = useRef<Input>(null);

    useEffect(() => {
        // check if component to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(actorToEdit)) {
            handleError("Tried to go to edit component without componentToedit specified");
            EditActions.setMode.edit();
        }
        // used to focus the textfield on create another
        textInput.current!.focus();
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
        if (!DavitUtil.isNullOrUndefined(actorToEdit) && text !== "") {
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
        textInput,
        setGroup,
        compGroup: actorToEdit?.actor.groupFks !== -1 ? actorToEdit?.actor.groupFks : undefined,
        updateActor,
        createAnother,
        id: actorToEdit?.actor.id || -1,
        note: actorToEdit ? actorToEdit.actor.note : "",
        saveNote,
    };
};
