import { useDispatch } from "react-redux";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";
import { EditActions } from "../../../slices/EditSlice";
import { SequenceModelActions } from "../../../slices/SequenceModelSlice";
import { DavitTableAction, DavitTableRowData } from "../../common/fragments/DavitTable";

export const useGetSequenceModelsTableBody = (sequences: SequenceTO[]) => {
    const dispatch = useDispatch();

    let bodyData: DavitTableRowData[] = [];
    if (sequences) {
        bodyData = sequences.map((sequence) => {
            const selectAction = () => {
                dispatch(SequenceModelActions.setCurrentSequence(sequence.id));
                dispatch(EditActions.setMode.view());
            };
            const editAction = () => dispatch(EditActions.setMode.editSequence(sequence.id));

            return createSequenceModelColumn(sequence, editAction, selectAction);
        });
    }
    return {
        header,
        bodyData,
    };
};

const header = ["NAME", "ACTIONS"];

const createSequenceModelColumn = (
    sequence: SequenceTO,
    editCallback: () => void,
    selectCallback: () => void,
): DavitTableRowData => {
    const name = sequence.name;
    const trClass = "carv2Tr";
    const editAction: DavitTableAction = { icon: "wrench", callback: editCallback };
    const selectAction: DavitTableAction = { icon: "hand pointer", callback: selectCallback };

    return {
        data: [name],
        trClass: trClass,
        actions: [editAction, selectAction],
    };
};
