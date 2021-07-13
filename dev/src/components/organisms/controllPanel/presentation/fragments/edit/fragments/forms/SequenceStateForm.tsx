import React, { FunctionComponent, useState } from "react";
import { useSelector } from "react-redux";
import { SequenceStateTO } from "../../../../../../../../dataAccess/access/to/SequenceStateTO";
import { StateTO } from "../../../../../../../../dataAccess/access/to/StateTO";
import { masterDataSelectors } from "../../../../../../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";
import { DavitBackButton, Form } from "../../../../../../../atomic";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { useSequenceViewModel } from "../viewmodels/SequenceViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { StateTable } from "./fragments/StateTable";

interface StateFormProps {
}

export const SequenceStateForm: FunctionComponent<StateFormProps> = () => {

    const {saveState, editSequence, createState, deleteState, id} = useSequenceViewModel();

    const sequenceStates: SequenceStateTO[] = useSelector(masterDataSelectors.selectSequenceStateBySequenceId(id));

    const [invalidIds, setInvalidIds] = useState<number[]>([]);

    const create = () => {
        createState();
    };

    const closeStateForm = () => {
        checkForDirty();
        if (!sequenceStates.some(state => state.label === "")) {
            sequenceStates.forEach(saveState);
            editSequence();
        }
    };

    const checkForDirty = () => {
        const invalidIds: number[] = sequenceStates
            .filter(state => state.label === "")
            .map(state => {
                return state.id;
            });
        setInvalidIds(invalidIds);
    };

    const toggle = (stateToToggle: StateTO) => {
        const copyStateToToggle: StateTO = DavitUtil.deepCopy(stateToToggle);
        copyStateToToggle.isState = !stateToToggle.isState;
        saveState(copyStateToToggle as SequenceStateTO);
    };

    const delState = (stateId: number) => {
        deleteState(stateId);
    };

    const changeName = (name: string, stateId: number) => {
        const stateToChangeName: SequenceStateTO | undefined = sequenceStates.find(state => state.id === stateId);
        if (stateToChangeName) {
            const copyStatToChangeName: SequenceStateTO = DavitUtil.deepCopy(stateToChangeName);
            copyStatToChangeName.label = name;
            saveState(copyStatToChangeName);
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

                <StateTable statesToEdit={sequenceStates}
                            addStateCallback={create}
                            removeStateCallback={delState}
                            toggleActiveCallback={toggle}
                            changeName={changeName}
                            dirty={invalidIds}
                />

            </FormBody>

            <FormFooter>
                <DavitBackButton onClick={closeStateForm} />
            </FormFooter>

        </Form>
    );
};
