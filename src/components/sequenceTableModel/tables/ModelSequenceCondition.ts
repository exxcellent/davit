import { useDispatch } from 'react-redux';
import { DecisionTO } from '../../../dataAccess/access/to/DecisionTO';
import { DavitTableRowData } from '../../common/fragments/DavitTable';

export const useGetModelSequenceConditionTableData = (decision: DecisionTO | null) => {
    const dispatch = useDispatch();

    let bodyData: DavitTableRowData[] = [];
    // if (decision !== null) {
    //     bodyData = decision.conditions.map((condition) => {
    //         // const onClickEdit = () => dispatch(EditActions.setMode.editDecision(dec));
    //         const createConditionColumn = useCreateConditionColumn(
    //             condition.actorFk,
    //             condition.dataFk,
    //             condition.instanceFk,
    //         );
    //     });
    // }
    // return {
    //     header,
    //     bodyData,
    // };
};

const header = ['ACTOR', 'DATA', 'INSTANCE'];

// const useCreateConditionColumn = (actorFk: number, dataFk: number, instanceFk: number): DavitTableRowData => {
//     const actorName: string =
//         useSelector(masterDataSelectors.selectActorById(actorFk))?.actor.name || 'Could not find actor';

//     const dataCTO: DataCTO | null = useSelector(masterDataSelectors.selectDataCTOById(dataFk));

//     const dataName: string = dataCTO?.data.name || 'Could not find data';
//     const instanceName: string =
//         dataCTO?.data.instances.find((instance) => instance.id === instanceFk)?.name || 'Could not find instance';

//     const trClass = 'carv2Tr';
//     // const editAction = { icon: 'wrench', callback: editCallback };

//     const create = () => {
//         return {
//             trClass,
//             data: [actorName, dataName, instanceName],
//             actions: [],
//         };
//     };
// };
