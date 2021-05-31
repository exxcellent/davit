import React, { FunctionComponent, useState } from "react";
import { DavitBackButton } from "../../../../../../atomic/buttons/DavitBackButton";
import { DavitButton } from "../../../../../../atomic/buttons/DavitButton";
import { DavitCommentButton } from "../../../../../../atomic/buttons/DavitCommentButton";
import { DavitDeleteButton } from "../../../../../../atomic/buttons/DavitDeleteButton";
import { DavitLabelTextfield } from "../../../../../../common/fragments/DavitLabelTextfield";
import { Form } from "../../../../../../common/fragments/forms/Form";
import { FormBody } from "../../../../../../common/fragments/forms/FormBody";
import { FormHeader } from "../../../../../../common/fragments/forms/FormHeader";
import { useActorViewModel } from "../viewmodels/ActorViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLine } from "./fragments/FormLine";

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
                        label="Name:"
                        placeholder="Actor Name"
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
                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
                <DavitButton onClick={() => {
                    createAnother();
                    setKey(key + 1);
                }}
                             label="Create another"
                />
                <DavitBackButton onClick={saveActor} />
            </FormLine>


        </Form>
    );
};
