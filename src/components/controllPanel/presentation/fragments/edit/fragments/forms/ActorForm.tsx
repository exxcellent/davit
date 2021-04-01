import React, { FunctionComponent, useState } from 'react';
import { DavitLabelTextfield } from '../../../../../../common/fragments/DavitLabelTextfield';
import { DavitCommentButton } from '../../../../../../common/fragments/buttons/DavitCommentButton';
import { DavitButton } from '../../../../../../common/fragments/buttons/DavitButton';
import { DavitBackButton } from '../../../../../../common/fragments/buttons/DavitBackButton';
import { DavitDeleteButton } from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import { useActorViewModel } from '../viewmodels/ActorViewModel';
import { FormLine } from './fragments/FormLine';
import { Form } from '../../../../../../common/fragments/forms/Form';
import { FormDivider } from './fragments/FormDivider';
import { FormHeader } from '../../../../../../common/fragments/forms/FormHeader';
import { FormBody } from '../../../../../../common/fragments/forms/FormBody';

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
    } = useActorViewModel();

    return (
        <Form key={key}>
            <FormHeader>
                <h2>Actor</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <FormLine>
                    <DavitLabelTextfield
                        label='Name:'
                        placeholder='Actor Name'
                        onChangeCallback={(name: string) => changeName(name)}
                        onBlur={updateActor}
                        value={name}
                        focus
                    />
                </FormLine>

            </FormBody>

            <FormDivider />

            <FormLine>
                <DavitDeleteButton onClick={deleteActor} />
                <DavitCommentButton onSaveCallback={saveNote} comment={note} />
                <DavitButton onClick={() => {
                    createAnother();
                    setKey(key + 1);
                }} label='Create another' />
                <DavitBackButton onClick={saveActor} />
            </FormLine>


        </Form>
    );
};
