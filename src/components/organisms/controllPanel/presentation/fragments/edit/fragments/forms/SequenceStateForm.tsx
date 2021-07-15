import React, { FunctionComponent } from "react";
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

    const closeStateForm = () => {
        if (!sequenceStates.some(state => state.label === "")) {
            sequenceStates.forEach(saveState);
            editSequence();
        }
    };

    const setIsState = (stateToToggle: StateTO, is: boolean) => {
        const copyStateToToggle: StateTO = DavitUtil.deepCopy(stateToToggle);
        copyStateToToggle.isState = is;
        saveState(copyStateToToggle as SequenceStateTO);
    };

    const changeName = (name: string, stateId: number) => {
        const stateToChangeName: SequenceStateTO | undefined = sequenceStates.find(state => state.id === stateId);
        if (stateToChangeName) {
            const copyStatToChangeName: SequenceStateTO = DavitUtil.deepCopy(stateToChangeName);
            copyStatToChangeName.label = name;
            saveState(copyStatToChangeName);
        }
    };

    return (
        <Form>
            <FormHeader>
                <h2>State</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <StateTable statesToEdit={sequenceStates}
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
