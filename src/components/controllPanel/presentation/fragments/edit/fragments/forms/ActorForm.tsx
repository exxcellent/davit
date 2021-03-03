import React, { FunctionComponent, useEffect, useState } from 'react';
import { DavitLabelTextfield } from '../../../../../../common/fragments/DavitLabelTextfield';
import { DavitCommentButton } from '../../../../../../common/fragments/buttons/DavitCommentButton';
import { DavitButton } from '../../../../../../common/fragments/buttons/DavitButton';
import { DavitBackButton } from '../../../../../../common/fragments/buttons/DavitBackButton';
import { DavitDeleteButton } from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import { ActorCTO } from '../../../../../../../dataAccess/access/cto/ActorCTO';
import { useDispatch, useSelector } from 'react-redux';
import { EditActions, editSelectors } from '../../../../../../../slices/EditSlice';
import { DavitUtil } from '../../../../../../../utils/DavitUtil';
import { GlobalActions } from '../../../../../../../slices/GlobalSlice';
import { EditActor } from '../../../../../../../slices/thunks/ActorThunks';

interface ActorFormProps {
}

export const ActorForm: FunctionComponent<ActorFormProps> = () => {

    const [key, setKey] = useState<number>(0);

    const actorToEdit: ActorCTO | null = useSelector(editSelectors.selectActorToEdit);
    console.info('actor to edit: ', actorToEdit);
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
        setKey(key + 1);
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

    return (
        <div className={'form'} key={key}>
            <DavitLabelTextfield
                label='Name:'
                placeholder='Actor Name'
                onChangeDebounced={(name: string) => changeName(name)}
                onBlur={updateActor}
                value={actorToEdit?.actor?.name || ""}
                focus
            />
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                paddingTop: 'var(--davit-padding-top-bottom)',
            }}>
                <DavitDeleteButton onClick={deleteActor} />
                <DavitCommentButton onSaveCallback={saveNote} comment={actorToEdit?.actor?.note || ''} />
                <DavitButton onClick={createAnother} label='Create another' />
                <DavitBackButton onClick={saveActor} />
            </div>
        </div>
    );
};
