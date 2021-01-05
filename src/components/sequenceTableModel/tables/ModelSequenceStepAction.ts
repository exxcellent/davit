import { useDispatch } from 'react-redux';
import { SequenceStepCTO } from '../../../dataAccess/access/cto/SequenceStepCTO';
import { ActionTO } from '../../../dataAccess/access/to/ActionTO';
import { ActionType } from '../../../dataAccess/access/types/ActionType';
import { DavitTableRowData } from '../../common/fragments/DavitTable';

export const useGetStepActionTableData = (
    selectedStep: SequenceStepCTO | null,
): { header: string[]; bodyData: DavitTableRowData[] } => {
    const dispatch = useDispatch();
    let list: DavitTableRowData[] = [];
    if (selectedStep !== null) {
        list = selectedStep.actions.map((action, index) => {
            const editCallback = () => {};
            return createModelActionColumn(index, action, editCallback);
        });
    }
    return {
        header,
        bodyData: list,
    };
};

const header = ['INDEX', 'TYPE', 'DATA', 'TO', 'FROM'];

const createModelActionColumn = (arrayIndex: number, action: ActionTO, editCallback: () => void): DavitTableRowData => {
    const actionIndex: string = arrayIndex.toString();
    const actionType: string = action.actionType;
    const data: string = getDataName(action.dataFk);
    const toActor: string = getActorName(action.receivingActorFk, action.actionType);
    const fromActor: string = getActorName(action.receivingActorFk, action.actionType);

    const trClass = 'carv2Tr';

    return {
        data: [actionIndex, actionType, data, toActor, fromActor],
        trClass,
        actions: [{ icon: 'wrench', callback: editCallback }],
    };
};

function getDataName(dataFk: number): string {
    // ...
    return 'dataName';
}

function getActorName(actorId: number, actionType: ActionType): string {
    let actorName = '';
    if (actionType === ActionType.SEND || actionType === ActionType.SEND_AND_DELETE) {
        actorName = 'actorName';
    }
    return actorName;
}
