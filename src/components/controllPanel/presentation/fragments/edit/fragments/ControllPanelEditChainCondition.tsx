import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ChainDecisionTO} from '../../../../../../dataAccess/access/to/ChainDecisionTO';
import {ChainTO} from '../../../../../../dataAccess/access/to/ChainTO';
import {EditActions, editSelectors} from '../../../../../../slices/EditSlice';
import {handleError} from '../../../../../../slices/GlobalSlice';
import {sequenceModelSelectors} from '../../../../../../slices/SequenceModelSlice';
import {DavitUtil} from '../../../../../../utils/DavitUtil';
import {DavitButtonIcon} from '../../../../../common/fragments/buttons/DavitButton';
import {DavitMenuLabel} from '../../../../../common/fragments/DavitMenuLabel';
import {ActorDropDown} from '../../../../../common/fragments/dropdowns/ActorDropDown';
import {DataAndInstanceId, InstanceDropDownMultiselect} from '../../../../../common/fragments/dropdowns/InstanceDropDown';
import {ControllPanelEditSub} from '../common/ControllPanelEditSub';
import {OptionField} from '../common/OptionField';


export interface ControllPanelEditChainConditionProps {
  hidden: boolean;
}

export const ControllPanelEditChainCondition: FunctionComponent<ControllPanelEditChainConditionProps> = (props) => {
  const {hidden} = props;
  const {
    label,
    setMode,
    actorFk,
    setActorFk,
    setData,
    selectedInstances,
  } = useControllPanelEditConditionViewModel();

  return (
    <ControllPanelEditSub label={label} hidden={hidden} onClickNavItem={setMode}>
      <div className="controllPanelEditChild">
        <OptionField label="Select Actor">
          <ActorDropDown value={actorFk?.toString()} onSelect={(actor) => setActorFk(actor?.actor.id || -1)} />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <DavitMenuLabel text="HAS" />
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="Select data for actor">
          <InstanceDropDownMultiselect
            onSelect={(data) => {
              setData(data);
            }}
            selected={selectedInstances || []}
          />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="Navigation">
          <DavitButtonIcon onClick={setMode} icon="reply" />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditConditionViewModel = () => {
  const decisionToEdit: ChainDecisionTO | null = useSelector(editSelectors.chainDecisionToEdit);
  const chain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
  const dispatch = useDispatch();

  useEffect(() => {
    if (DavitUtil.isNullOrUndefined(decisionToEdit)) {
      dispatch(handleError('Tried to go to edit chain decision without decisionToEdit specified'));
      dispatch(EditActions.setMode.edit());
    }
  }, [dispatch, decisionToEdit]);

  const setData = (dataAndInstanceIds: DataAndInstanceId[] | undefined) => {
    if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
      const copyDecisionToEdit: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
      copyDecisionToEdit.dataAndInstanceIds = dataAndInstanceIds || [];
      dispatch(EditActions.chainDecision.create(copyDecisionToEdit));
    }
  };

  const setMode = (newMode?: string) => {
    if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
      if (newMode && newMode === 'EDIT') {
        dispatch(EditActions.setMode.edit());
      } else if (newMode && newMode === 'CHAIN') {
        dispatch(EditActions.setMode.editChain(chain || undefined));
      } else {
        dispatch(EditActions.setMode.editChainDecision(decisionToEdit!));
      }
    } else {
      console.info('decisionToEdit is null!');
    }
  };

  const setActorFk = (actorId: number) => {
    if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
      const copyDecisionToEdit: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
      copyDecisionToEdit.actorFk = actorId;
      dispatch(EditActions.chainDecision.create(copyDecisionToEdit));
    }
  };

  return {
    label: 'EDIT * ' + (chain?.name || '') + ' * ' + (decisionToEdit?.name || '') + ' * CONDITION',
    setMode,
    actorFk: decisionToEdit?.actorFk,
    setActorFk,
    setData,
    selectedInstances: decisionToEdit?.dataAndInstanceIds,
  };
};
