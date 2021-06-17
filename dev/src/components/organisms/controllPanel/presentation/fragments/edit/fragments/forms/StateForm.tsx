import React, { FunctionComponent } from "react";
import { DavitBackButton } from "../../../../../../../atomic";
import { Form } from "../../../../../../../atomic/forms/Form";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { useSequenceViewModel } from "../viewmodels/SequenceViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { StateTable } from "./fragments/StateTable";

interface StateFormProps {
}

//TODO: rename in SequenceStateForm!
//TODO: create ChainStateForm.

export const StateForm: FunctionComponent<StateFormProps> = () => {

    const {states, saveStates} = useSequenceViewModel();

    return (
        <Form>
            <FormHeader>
                <h2>State</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <StateTable statesToEdit={states}
                    //TODO: implement method
                            removeStateCallback={() => {
                            }}
                    //TODO: implement method
                            toggleActiveCallback={() => {
                            }}
                />

            </FormBody>

            <FormFooter>
                <DavitBackButton onClick={saveStates} />
            </FormFooter>

        </Form>
    );
};
