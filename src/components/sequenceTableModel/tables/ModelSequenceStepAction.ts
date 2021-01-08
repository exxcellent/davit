import { useDispatch, useSelector } from 'react-redux';
import { ActorCTO } from '../../../dataAccess/access/cto/ActorCTO';
import { DataCTO } from '../../../dataAccess/access/cto/DataCTO';
import { ActionTO } from '../../../dataAccess/access/to/ActionTO';
import { ActionType } from '../../../dataAccess/access/types/ActionType';
import { EditActions, editSelectors } from '../../../slices/EditSlice';
import { masterDataSelectors } from '../../../slices/MasterDataSlice';
import { DavitUtil } from '../../../utils/DavitUtil';
import { DavitTableRowData } from '../../common/fragments/DavitTable';

export const useGetStepActionTableData = (
    selectedActions: ActionTO[],
): { header: string[]; bodyData: DavitTableRowData[] } => {
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);
    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
    const actionToEdit: ActionTO | null = useSelector(editSelectors.selectActionToEdit);
    const dispatch = useDispatch();

    let list: DavitTableRowData[] = [];

    if (selectedActions !== null) {
        list = selectedActions.map((action, index) => {
            const editCallback = () => {
                dispatch(EditActions.setMode.editAction(action));
            };
            const indexIncrementCallback = () => {
                const copyActions: ActionTO[] = DavitUtil.deepCopy(selectedActions);
                if (index < copyActions.length - 1) {
                    const action1: ActionTO = copyActions[index];
                    const action2: ActionTO = copyActions[index + 1];
                    copyActions[index] = action2;
                    copyActions[index + 1] = action1;
                }

                // TODO: save new indexed Actions in Step Array!
            };
            const indexDecrementCallback = () => {
                const copyActions: ActionTO[] = DavitUtil.deepCopy(selectedActions);
                if (index > 0) {
                    const action1: ActionTO = copyActions[index];
                    const action2: ActionTO = copyActions[index - 1];
                    copyActions[index] = action2;
                    copyActions[index - 1] = action1;
                }

                // TODO: save new indexed Actions in Step Array!
            };

            const dataName: string = datas.find((data) => data.data.id === action.dataFk)?.data.name || '';

            const toActorName: string =
                actors.find((actor) => actor.actor.id === action.receivingActorFk)?.actor.name || '';

            const fromActorName: string =
                actors.find((actor) => actor.actor.id === action.sendingActorFk)?.actor.name || '';

            return createModelActionColumn(
                index,
                action.actionType,
                dataName,
                toActorName,
                fromActorName,
                editCallback,
                indexIncrementCallback,
                indexDecrementCallback,
                selectedActions.length,
                action.id === actionToEdit?.id,
            );
        });
    }
    return {
        header,
        bodyData: list,
    };
};

const header = ['INDEX', 'TYPE', 'DATA', 'TO', 'FROM', 'ACTIONS'];

const createModelActionColumn = (
    arrayIndex: number,
    actionType: ActionType,
    dataName: string,
    toActorName: string,
    fromActorName: string,
    editCallback: () => void,
    indexIncrementCallback: () => void,
    indexDecrementCallback: () => void,
    arrayLength: number,
    marked?: boolean,
): DavitTableRowData => {
    const actionIndex: string = arrayIndex.toString();
    const trClass = marked ? 'carv2TrMarked' : 'carv2Tr';

    return {
        data: [actionIndex, actionType, dataName, toActorName, fromActorName],
        trClass,
        actions: [
            { icon: 'angle up', callback: indexDecrementCallback, disable: arrayIndex === 0 },
            { icon: 'angle down', callback: indexIncrementCallback, disable: arrayIndex >= arrayLength - 1 },
            { icon: 'wrench', callback: editCallback },
        ],
    };
};
