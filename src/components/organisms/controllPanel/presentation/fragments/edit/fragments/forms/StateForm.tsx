import React, { FunctionComponent } from "react";
import { ChainStateTO } from "../../../../../../../../dataAccess/access/to/ChainStateTO";
import { SequenceStateTO } from "../../../../../../../../dataAccess/access/to/SequenceStateTO";
import { Form } from "../../../../../../../atomic/forms/Form";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { FormDivider } from "./fragments/FormDivider";
import { StateTable } from "./fragments/StateTable";

interface StateFormProps {
    statesToEdit: SequenceStateTO[] | ChainStateTO[];
}

export const StateForm: FunctionComponent<StateFormProps> = (props) => {

    const {statesToEdit} = props;

    return (
        <Form>
            <FormHeader>
                <h2>State</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <StateTable sequenceStates={statesToEdit}
                            removeStateCallback={removeState}
                            toggleActiveCallback={toggleState}
                />

            </FormBody>

            <FormFooter>
                {/*<DavitDeleteButton onClick={deleteDataSetup} />*/}
                {/*<DavitCommentButton onSaveCallback={saveNote}*/}
                {/*                    comment={note}*/}
                {/*/>*/}
                {/*<DavitButton onClick={createAnother}>*/}
                {/*    {"Create another"}*/}
                {/*</DavitButton>*/}
                {/*<DavitBackButton onClick={saveDataSetup} />*/}
            </FormFooter>

        </Form>
    );
};
