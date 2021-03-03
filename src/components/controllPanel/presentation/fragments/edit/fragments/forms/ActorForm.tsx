import React, { FunctionComponent, useState } from 'react';
import { DavitLabelTextfield } from '../../../../../../common/fragments/DavitLabelTextfield';
import { DavitCommentButton } from '../../../../../../common/fragments/buttons/DavitCommentButton';
import { DavitButton } from '../../../../../../common/fragments/buttons/DavitButton';
import { DavitBackButton } from '../../../../../../common/fragments/buttons/DavitBackButton';
import { DavitDeleteButton } from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import { useEditActorViewModel } from '../viewmodels/EditActorViewModel';

interface ActorFormProps {
}

export const ActorForm: FunctionComponent<ActorFormProps> = () => {

    const [key, setKey] = useState<number>(0);

    const {
        changeName,
        updateActor,
        deleteActor,
        saveNote,
        createAnother,
        saveActor,
        name,
        note,
    } = useEditActorViewModel();

    return (
        <div className={'form'} key={key}>
            <DavitLabelTextfield
                label='Name:'
                placeholder='Actor Name'
                onChangeDebounced={(name: string) => changeName(name)}
                onBlur={updateActor}
                value={name}
                focus
            />
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                paddingTop: 'var(--davit-padding-top-bottom)',
            }}>
                <DavitDeleteButton onClick={deleteActor} />
                <DavitCommentButton onSaveCallback={saveNote} comment={note} />
                <DavitButton onClick={() => {
                    createAnother();
                    setKey(key + 1);
                }} label='Create another' />
                <DavitBackButton onClick={saveActor} />
            </div>
        </div>
    );
};
