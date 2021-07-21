import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { SequenceStateTO } from "../../../../../dataAccess/access/to/SequenceStateTO";

export const useGetFalseState = (errorStates: SequenceStateTO[]) => {

    const bodyData: DavitTableRowData[] = errorStates.map(createFalseStateColumn);

    return {
        header,
        bodyData,
    };
};

const header = ["State", "Is", "should"];

const createFalseStateColumn = (state: SequenceStateTO): DavitTableRowData => {
    const trClass = "carv2Tr";

    return {
        data: [state.label, state.isState.toString(), (!state.isState).toString()],
        trClass,
        actions: [],
    };
};
