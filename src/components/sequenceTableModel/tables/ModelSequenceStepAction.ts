import { useDispatch, useSelector } from 'react-redux';
import { ActorCTO } from '../../../dataAccess/access/cto/ActorCTO';
import { DataCTO } from '../../../dataAccess/access/cto/DataCTO';
import { SequenceStepCTO } from '../../../dataAccess/access/cto/SequenceStepCTO';
import { ActionTO } from '../../../dataAccess/access/to/ActionTO';
import { ActionType } from '../../../dataAccess/access/types/ActionType';
import { EditActions, editSelectors, Mode } from '../../../slices/EditSlice';
import { masterDataSelectors } from '../../../slices/MasterDataSlice';
import { SequenceModelActions } from '../../../slices/SequenceModelSlice';
import { EditStep } from '../../../slices/thunks/StepThunks';
import { DavitUtil } from '../../../utils/DavitUtil';
import { DavitTableRowData } from '../../common/fragments/DavitTable';

export const useGetStepActionTableData = (
    selectedStep: SequenceStepCTO | null,
): { header: string[]; bodyData: DavitTableRowData[] } => {
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);
    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
    const actionToEdit: ActionTO | null = useSelector(editSelectors.selectActionToEdit);
    const mode: Mode = useSelector(editSelectors.selectMode);
    const dispatch = useDispatch();

    let list: DavitTableRowData[] = [];

    if (selectedStep !== null) {
        list = selectedStep.actions.map((action, index) => {
            const editCallback = () => {
                dispatch(EditActions.setMode.editAction(action));
            };

            // TODO: refactor this two functions! there is a lot of double code!
            const indexIncrementCallback = () => {
                const copyStep: SequenceStepCTO = DavitUtil.deepCopy(selectedStep);
                if (index < copyStep.actions.length - 1) {
                    const action1: ActionTO = copyStep.actions[index];
                    action1.index = index + 1;
                    const action2: ActionTO = copyStep.actions[index + 1];
                    action2.index = index;
                    copyStep.actions[index] = action2;
                    copyStep.actions[index + 1] = action1;
                }

                dispatch(EditStep.save(copyStep));

                dispatch(SequenceModelActions.setCurrentSequence(copyStep.squenceStepTO.sequenceFk));

                if (mode === Mode.EDIT_SEQUENCE_STEP) {
                    dispatch(EditStep.update(copyStep));
                }
            };

            // TODO: function 2 s.o.
            const indexDecrementCallback = () => {
                const copyStep: SequenceStepCTO = DavitUtil.deepCopy(selectedStep);
                if (index > 0) {
                    const action1: ActionTO = copyStep.actions[index];
                    action1.index = index - 1;
                    const action2: ActionTO = copyStep.actions[index - 1];
                    action2.index = index;
                    copyStep.actions[index] = action2;
                    copyStep.actions[index - 1] = action1;
                }

                dispatch(EditStep.save(copyStep));

                dispatch(SequenceModelActions.setCurrentSequence(copyStep.squenceStepTO.sequenceFk));

                if (mode === Mode.EDIT_SEQUENCE_STEP) {
                    dispatch(EditStep.update(copyStep));
                }
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
                selectedStep.actions.length,
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
