import React, { FunctionComponent, useState } from "react";
import { ChainStateTO } from "../../../../../../../../dataAccess/access/to/ChainStateTO";
import { StateTO } from "../../../../../../../../dataAccess/access/to/StateTO";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";
import { DavitBackButton, Form } from "../../../../../../../atomic";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { useChainViewModel } from "../viewmodels/ChainViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { StateTable } from "./fragments/StateTable";

interface ChainStateFormProps {
}

export const ChainStateForm: FunctionComponent<ChainStateFormProps> = () => {

    // const {getState, saveState, editSequence, createState, deleteState} = useSequenceViewModel();
    const {getState, saveState, editChain, createState, deleteState} = useChainViewModel();

    const [states, setState] = useState<ChainStateTO[]>(getState());
    const [dirty, setDirty] = useState<number[]>([]);

    const create = () => {
        createState();
        setState(getState());
    };

    const closeStateForm = () => {
        setState(getState());
        checkForDirty();
        if (!states.some(state => state.label === "")) {
            states.forEach(saveState);
            editChain();
        }
    };

    const checkForDirty = () => {
        const dirtyStates: number[] = states.filter(state => state.label === "").map(state => {
            return state.id;
        });
        setDirty(dirtyStates);
    };

    const toggle = (stateToToggle: StateTO) => {
        const copyStateToToggle: StateTO = DavitUtil.deepCopy(stateToToggle);
        copyStateToToggle.isState = !stateToToggle.isState;
        saveState(copyStateToToggle as ChainStateTO);
        setState(getState());
    };

    const delState = (stateId: number) => {
        deleteState(stateId);
        setState(getState());
    };

    const changeName = (name: string, stateId: number) => {
        const stateToChangeName: ChainStateTO | undefined = states.find(state => state.id === stateId);
        if (stateToChangeName) {
            stateToChangeName.label = name;
            saveState(stateToChangeName);
            setState(getState());
        }
        checkForDirty();
    };

    return (
        <Form>
            <FormHeader>
                <h2>State</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <StateTable statesToEdit={states}
                            addStateCallback={create}
                            removeStateCallback={delState}
                            toggleActiveCallback={toggle}
                            changeName={changeName}
                            dirty={dirty}
                />

            </FormBody>

            <FormFooter>
                <DavitBackButton onClick={closeStateForm} />
            </FormFooter>

        </Form>
    );
};
