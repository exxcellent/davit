import { ActorCTO } from '../../../../../../../dataAccess/access/cto/ActorCTO';
import { useDispatch, useSelector } from 'react-redux';
import { EditActions, editSelectors } from '../../../../../../../slices/EditSlice';
import { useEffect } from 'react';
import { DavitUtil } from '../../../../../../../utils/DavitUtil';
import { GlobalActions } from '../../../../../../../slices/GlobalSlice';
import { EditActor } from '../../../../../../../slices/thunks/ActorThunks';

export const useActorViewModel = () => {

    const actorToEdit: ActorCTO | null = useSelector(editSelectors.selectActorToEdit);
    const dispatch = useDispatch();

    useEffect(() => {
// check if component to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(actorToEdit)) {
            dispatch(GlobalActions.handleError('Tried to go to edit component without component To edit specified'));
            EditActions.setMode.edit();
        }
    }, [actorToEdit, dispatch]);

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
            if (actorToEdit?.actor.name !== '') {
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

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(actorToEdit)) {
            const copyActor: ActorCTO = DavitUtil.deepCopy(actorToEdit);
            copyActor.actor.note = text;
            dispatch(EditActions.setMode.editActor(copyActor));
        }
    };

    return {
        saveActor,
        createAnother,
        saveNote,
        deleteActor,
        updateActor,
        changeName,
        name: actorToEdit?.actor?.name || '',
        note: actorToEdit?.actor?.note || '',
    };

};
