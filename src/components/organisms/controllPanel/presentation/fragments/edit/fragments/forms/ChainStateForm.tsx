import React, { FunctionComponent } from "react";
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

    const closeStateForm = () => {
        if (!chainStates.some(state => state.label === "")) {
            chainStates.forEach(saveState);
            editChain();
        }
    };

    const setIsState = (stateToToggle: StateTO, is: boolean) => {
        const copyStateToToggle: StateTO = DavitUtil.deepCopy(stateToToggle);
        copyStateToToggle.isState = is;
        saveState(copyStateToToggle as ChainStateTO);
    };

    const changeName = (name: string, stateId: number) => {
        const stateToChangeName: ChainStateTO | undefined = chainStates.find(state => state.id === stateId);
        if (stateToChangeName) {
            const copyStateToChangeName: ChainStateTO = DavitUtil.deepCopy(stateToChangeName);
            copyStateToChangeName.label = name;
            saveState(copyStateToChangeName);
        }
    };

    return (
        <Form>
            <FormHeader>
                <h2>State</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <StateTable statesToEdit={chainStates}
                            addStateCallback={createState}
                            removeStateCallback={deleteState}
                            setActiveCallback={setIsState}
                            changeName={changeName}
                />

            </FormBody>

            <FormFooter>
                <DavitBackButton onClick={closeStateForm} />
            </FormFooter>

        </Form>
    );
};
