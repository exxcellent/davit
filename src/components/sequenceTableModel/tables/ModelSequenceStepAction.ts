import { useSelector } from 'react-redux';
import { ActorCTO } from '../../../dataAccess/access/cto/ActorCTO';
import { DataCTO } from '../../../dataAccess/access/cto/DataCTO';
import { ActionTO } from '../../../dataAccess/access/to/ActionTO';
import { ActionType } from '../../../dataAccess/access/types/ActionType';
import { masterDataSelectors } from '../../../slices/MasterDataSlice';
import { DavitTableRowData } from '../../common/fragments/DavitTable';

export const useGetStepActionTableData = (
    selectedActions: ActionTO[],
): { header: string[]; bodyData: DavitTableRowData[] } => {
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);
    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
    // const dispatch = useDispatch();

    let list: DavitTableRowData[] = [];

    if (selectedActions !== null) {
        list = selectedActions.map((action, index) => {
            const editCallback = () => {};

            const dataName: string = datas.find((data) => data.data.id === action.dataFk)?.data.name || '';

            const toActorName: string =
                actors.find((actor) => actor.actor.id === action.receivingActorFk)?.actor.name || '';

            const fromActorName: string =
                actors.find((actor) => actor.actor.id === action.sendingActorFk)?.actor.name || '';

            console.info('dataName: ', dataName);
            console.info('toAcotrName: ', toActorName);
            console.info('fromActorName: ', fromActorName);

            return createModelActionColumn(
                index,
                action.actionType,
                dataName,
                toActorName,
                fromActorName,
                editCallback,
            );
        });
    }
    return {
        header,
        bodyData: list,
    };
};

const header = ['INDEX', 'TYPE', 'DATA', 'TO', 'FROM'];

const createModelActionColumn = (
    arrayIndex: number,
    actionType: ActionType,
    dataName: string,
    toActorName: string,
    fromActorName: string,
    editCallback: () => void,
): DavitTableRowData => {
    const actionIndex: string = arrayIndex.toString();
    const trClass = 'carv2Tr';

    return {
        data: [actionIndex, actionType, dataName, toActorName, fromActorName],
        trClass,
        // actions: [{ icon: 'wrench', callback: editCallback }],
        // TODO: add index + 1 and index -1
        actions: [],
    };
};
