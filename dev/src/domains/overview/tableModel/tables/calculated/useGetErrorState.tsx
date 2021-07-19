import { DavitTableRowData } from "../../../../../components/organisms/table/DavitTable";
import { SequenceStateTO } from "../../../../../dataAccess/access/to/SequenceStateTO";

export const useGetErrorState = (errorStates: SequenceStateTO[]) => {

    const bodyData: DavitTableRowData[] = errorStates.map(createErrorStateColumn);

    return {
        header,
        bodyData,
    };
};

const header = ["State"];

const createErrorStateColumn = (state: SequenceStateTO): DavitTableRowData => {
    const trClass = "carv2Tr";

    return {
        data: [state.label],
        trClass,
        actions: [],
    };
};
