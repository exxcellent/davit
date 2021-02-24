import React, {FunctionComponent, Ref, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ActorCTO} from "../../../../../../dataAccess/access/cto/ActorCTO";
import {GroupTO} from "../../../../../../dataAccess/access/to/GroupTO";
import {EditActions, editSelectors} from "../../../../../../slices/EditSlice";
import {handleError} from "../../../../../../slices/GlobalSlice";
import {EditActor} from "../../../../../../slices/thunks/ActorThunks";
import {DavitUtil} from "../../../../../../utils/DavitUtil";
import {DavitBackButton} from "../../../../../common/fragments/buttons/DavitBackButton";
import {DavitButton} from "../../../../../common/fragments/buttons/DavitButton";
import {DavitDeleteButton} from "../../../../../common/fragments/buttons/DavitDeleteButton";
import {DavitLabelTextfield} from "../../../../../common/fragments/DavitLabelTextfield";
import {DavitModal} from "../../../../../common/fragments/DavitModal";
import {DavitNoteForm} from "../../../../../common/fragments/forms/DavitNoteForm";
import {ControllPanelEditSub} from "../common/ControllPanelEditSub";
import {OptionField} from "../common/OptionField";

export interface ControlPanelEditActorProps {
    hidden: boolean;
}

export const ControlPanelEditActor: FunctionComponent<ControlPanelEditActorProps> = (props) => {
    const {hidden} = props;

    const [showNote, setShowNote] = useState<boolean>(false);

    const textInput: Ref<HTMLInputElement> = useRef<HTMLInputElement>(null);

    // focus on input field on render.
    useEffect(() => {
        if (textInput !== null && textInput.current !== null) {
            textInput.current.focus();
        }
    }, [textInput]);

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
                        ref={textInput}
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
        </ControllPanelEditSub>
    );
};

const useControllPanelEditActorViewModel = () => {
    const actorToEdit: ActorCTO | null = useSelector(editSelectors.selectActorToEdit);
    const dispatch = useDispatch();


    useEffect(() => {
        // check if component to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(actorToEdit)) {
            handleError("Tried to go to edit component without componentToedit specified");
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
        setGroup,
        compGroup: actorToEdit?.actor.groupFks !== -1 ? actorToEdit?.actor.groupFks : undefined,
        updateActor,
        createAnother,
        id: actorToEdit?.actor.id || -1,
        note: actorToEdit ? actorToEdit.actor.note : "",
        saveNote,
    };
};
