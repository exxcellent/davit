import { useDispatch } from "react-redux";
import { SequenceCTO } from "../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { DecisionTO } from "../../../../dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes, Intermediate } from "../../../../dataAccess/access/types/GoToType";
import { EditActions } from "../../../../slices/EditSlice";
import { DavitTableRowData } from "../../../common/fragments/DavitTable";
import { DavitIcons } from '../../../common/IconSet';

export const useGetStepTableData = (
    selectedSequence: SequenceCTO | null,
): { header: string[]; bodyData: DavitTableRowData[] } => {
    const dispatch = useDispatch();
    let list: DavitTableRowData[] = [];
    if (selectedSequence !== null) {
        list = selectedSequence.sequenceStepCTOs.map((step) => {
            const editCallback = () => dispatch(EditActions.setMode.editStep(step));
            return createModelStepColumn(step, selectedSequence, editCallback);
        });
    }
    return {
        header,
        bodyData: list,
    };
};

const header = ["NAME", "GOTO", "START", "ACTIONS"];

const createModelStepColumn = (
    step: SequenceStepCTO,
    selectedSequence: SequenceCTO,
    editCallback: () => void,
): DavitTableRowData => {
    const name = step.squenceStepTO.name;
    const gotoName: string = getGotoName(
        step.squenceStepTO.goto,
        selectedSequence?.sequenceStepCTOs || [],
        selectedSequence?.decisions || [],
    );
    const start: string = step.squenceStepTO.root ? "start" : "";

    const trClass = "carv2Tr";

    return {
        data: [name, gotoName, start],
        trClass,
        actions: [{ icon: DavitIcons.wrench, callback: editCallback }],
    };
};

function getGotoName(goto: GoTo, steps: SequenceStepCTO[], decisions: DecisionTO[]) {
    let gotoName: string = "could not find goto";
    switch (goto.type) {
        case GoToTypes.ERROR:
        case GoToTypes.FIN:
        case GoToTypes.IDLE:
            gotoName = goto.type;
            break;
        case GoToTypes.STEP:
            gotoName =
                steps.find((step) => step.squenceStepTO.id === (goto as Intermediate).id)?.squenceStepTO.name ||
                gotoName;
            break;
        case GoToTypes.DEC:
            gotoName = decisions.find((dec) => dec.id === (goto as Intermediate).id)?.name || gotoName;
            break;
    }
    return gotoName;
}
