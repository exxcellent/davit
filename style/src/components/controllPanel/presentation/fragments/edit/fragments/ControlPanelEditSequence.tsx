import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { DecisionTO } from "../../../../../../dataAccess/access/to/DecisionTO";
import { SequenceTO } from "../../../../../../dataAccess/access/to/SequenceTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { EditSequence } from "../../../../../../slices/thunks/SequenceThunks";
import { DavitUtil } from "../../../../../../utils/DavitUtil";
import { AddOrEdit } from "../../../../../common/fragments/AddOrEdit";
import { DavitBackButton } from "../../../../../common/fragments/buttons/DavitBackButton";
import { DavitButton } from "../../../../../common/fragments/buttons/DavitButton";
import { DavitCommentButton } from "../../../../../common/fragments/buttons/DavitCommentButton";
import { DavitDeleteButton } from "../../../../../common/fragments/buttons/DavitDeleteButton";
import { DavitLabelTextfield } from "../../../../../common/fragments/DavitLabelTextfield";
import { DecisionLabelDropDown } from "../../../../../common/fragments/dropdowns/DecisionDropDown";
import { StepLabelDropDown } from "../../../../../common/fragments/dropdowns/StepDropDown";
import { ControlPanel } from "../common/ControlPanel";
import { OptionField } from "../common/OptionField";

export interface ControlPanelEditSequenceProps {
}

export const ControlPanelEditSequence: FunctionComponent<ControlPanelEditSequenceProps> = () => {

    const {
        name,
        changeName,
        deleteSequence,
        saveSequence,
        editOrAddSequenceStep,
        createAnother,
        updateSequence,
        editOrAddDecision,
        note,
        saveNote,
    } = useControlPanelEditSequenceViewModel();

    return (
        <ControlPanel>
            <OptionField label="Sequence - name">
                <DavitLabelTextfield
                    label="Name:"
                    placeholder="Sequence Name..."
                    onChangeCallback={(name: string) => changeName(name)}
                    value={name}
                    focus={true}
                    onBlur={updateSequence}
                />
            </OptionField>
            <OptionField label="Create / Edit | Sequence - Step"
                         divider={true}
            >
                <AddOrEdit addCallBack={editOrAddSequenceStep}
                           dropDown={<StepLabelDropDown onSelect={editOrAddSequenceStep}
                                                        label="Step"
                           />}
                />
            </OptionField>
            <OptionField label="Create / Edit | Sequence - Decision"
                         divider={true}
            >
                <AddOrEdit addCallBack={editOrAddDecision}
                           dropDown={<DecisionLabelDropDown onSelect={editOrAddDecision}
                                                            label="Decision"
                           />}
                />
            </OptionField>
            <OptionField label={"options"}
                         divider={true}
            >
                <DavitButton onClick={createAnother}
                             label="Create another"
                />
                <DavitBackButton onClick={saveSequence} />
                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
                <DavitDeleteButton onClick={deleteSequence} />
            </OptionField>
        </ControlPanel>
    )
        ;
};

const useControlPanelEditSequenceViewModel = () => {
    const sequenceToEdit: SequenceTO | null = useSelector(editSelectors.selectSequenceToEdit);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const dispatch = useDispatch();
    const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit sequence without sequenceToedit specified"));
            dispatch(EditActions.setMode.edit());
        }
        if (sequenceToEdit?.id !== -1) {
            setIsCreateAnother(false);
        }
    }, [sequenceToEdit, dispatch]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            const copySequenceToEdit: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
            copySequenceToEdit.name = name;
            dispatch(EditSequence.save(copySequenceToEdit));
        }
    };

    const saveSequence = () => {
        if (sequenceToEdit!.name !== "") {
            dispatch(EditSequence.save(sequenceToEdit!));
        } else {
            dispatch(EditSequence.delete(sequenceToEdit!));
        }
        if (isCreateAnother) {
            dispatch(EditActions.setMode.editSequence());
        } else {
            dispatch(EditActions.setMode.edit());
        }
    };

    const deleteSequence = () => {
        dispatch(EditSequence.delete(sequenceToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const validateInput = (): boolean => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit)) {
            return DavitUtil.isValidName(sequenceToEdit!.name);
        } else {
            return false;
        }
    };

    const editOrAddSequenceStep = (step?: SequenceStepCTO) => {
        let stepToEdit: SequenceStepCTO | undefined = step;
        if (stepToEdit === undefined) {
            stepToEdit = new SequenceStepCTO();
            stepToEdit.squenceStepTO.sequenceFk = sequenceToEdit?.id || -1;
            stepToEdit.squenceStepTO.root = isFirst();
        }
        dispatch(EditActions.setMode.editStep(stepToEdit));
    };

    const editOrAddDecision = (decision?: DecisionTO) => {
        let decisionToEdit: DecisionTO | undefined = decision;
        if (decisionToEdit === undefined) {
            decisionToEdit = new DecisionTO();
            decisionToEdit.sequenceFk = sequenceToEdit?.id || -1;
            decisionToEdit.root = isFirst();
        }
        dispatch(EditActions.setMode.editDecision(decisionToEdit));
    };

    const isFirst = (): boolean => {
        return selectedSequence?.sequenceStepCTOs.length === 0 && selectedSequence.decisions.length === 0;
    };

    const copySequence = () => {
        const copySequence: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
        copySequence.name = sequenceToEdit?.name + "-copy";
        copySequence.id = -1;
        dispatch(EditSequence.update(copySequence));
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editSequence());
    };

    const updateSequence = () => {
        const copySequence: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
        dispatch(EditSequence.save(copySequence));
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(sequenceToEdit) && text !== "") {
            const copySequenceToEdit: SequenceTO = DavitUtil.deepCopy(sequenceToEdit);
            copySequenceToEdit.note = text;
            dispatch(EditSequence.save(copySequenceToEdit));
        }
    };

    return {
        label: "EDIT * " + (sequenceToEdit?.name || ""),
        name: sequenceToEdit?.name,
        changeName,
        saveSequence,
        deleteSequence,
        editOrAddSequenceStep,
        validateInput,
        copySequence,
        createAnother,
        updateSequence,
        editOrAddDecision,
        id: sequenceToEdit?.id || -1,
        note: sequenceToEdit ? sequenceToEdit.note : "",
        saveNote,
    };
};
