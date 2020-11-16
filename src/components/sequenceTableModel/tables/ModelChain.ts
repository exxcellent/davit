import {useDispatch} from 'react-redux';
import {ChainTO} from '../../../dataAccess/access/to/ChainTO';
import {EditActions} from '../../../slices/EditSlice';
import {SequenceModelActions} from '../../../slices/SequenceModelSlice';
import {DavitTableRowData} from '../../common/fragments/DavitTable';

export const useGetChainModelsTableData = (chainModels: ChainTO[]) => {
  const dispatch= useDispatch();
  let bodyData: DavitTableRowData[] = [];
  if (chainModels) {
    bodyData = chainModels.map((chain) =>{
      const onClickEdit=() => dispatch(EditActions.setMode.editChain(chain));
      const onClickSelect=() => {
        dispatch(SequenceModelActions.setCurrentChain(chain));
        dispatch(EditActions.setMode.view());
      };
      return createChainModelColumn(chain, onClickEdit, onClickSelect);
    },
    );
  }
  return {
    bodyData,
    header,
  };
};

const header = ['NAME', 'ACTIONS'];

const createChainModelColumn = (
    chain: ChainTO,
    editCallback: ()=>void,
    selectCallback: ()=> void,
): DavitTableRowData => {
  const name = chain.name;
  const trClass = 'carv2Tr';
  const editAction = {icon: 'wrench', callback: editCallback};
  const selectAction = {icon: 'hand pointer', callback: selectCallback};

  return {
    trClass,
    data: [name],
    actions: [editAction, selectAction],
  };
};
