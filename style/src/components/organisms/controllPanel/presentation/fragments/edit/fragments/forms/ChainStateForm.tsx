import React, { FunctionComponent, useState } from "react";
import { useSelector } from "react-redux";
import { ChainStateTO } from "../../../../../../../../dataAccess/access/to/ChainStateTO";
import { StateTO } from "../../../../../../../../dataAccess/access/to/StateTO";
import { masterDataSelectors } from "../../../../../../../../slices/MasterDataSlice";
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

    const {saveState, editChain, createState, deleteState, id} = useChainViewModel();

    const chainStates: ChainStateTO[] = useSelector(masterDataSelectors.selectChainStateByChainId(id));

    const [dirty, setDirty] = useState<number[]>([]);

    const create = () => {
        createState();
    };

    const closeStateForm = () => {
        checkForDirty();
        if (!chainStates.some(state => state.label === "")) {
            chainStates.forEach(saveState);
            editChain();
        }
    };

    const checkForDirty = () => {
        const invalidIds: number[] = chainStates
            .filter(state => state.label === "")
            .map(state => {
                return state.id;
            });
        setDirty(invalidIds);
    };

    const toggle = (stateToToggle: StateTO) => {
        const copyStateToToggle: StateTO = DavitUtil.deepCopy(stateToToggle);
        copyStateToToggle.isState = !stateToToggle.isState;
        saveState(copyStateToToggle as ChainStateTO);
    };

    const delState = (stateId: number) => {
        deleteState(stateId);
    };

    const changeName = (name: string, stateId: number) => {
        const stateToChangeName: ChainStateTO | undefined = chainStates.find(state => state.id === stateId);
        if (stateToChangeName) {
            const copyStateToChangeName: ChainStateTO = DavitUtil.deepCopy(stateToChangeName);
            copyStateToChangeName.label = name;
            saveState(copyStateToChangeName);
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

                <StateTable statesToEdit={chainStates}
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
