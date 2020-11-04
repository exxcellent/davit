import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SequenceCTO} from '../../../../../../dataAccess/access/cto/SequenceCTO';
import {DecisionTO} from '../../../../../../dataAccess/access/to/DecisionTO';
import {EditActions, editSelectors} from '../../../../../../slices/EditSlice';
import {handleError} from '../../../../../../slices/GlobalSlice';
import {sequenceModelSelectors} from '../../../../../../slices/SequenceModelSlice';
import {Carv2Util} from '../../../../../../utils/Carv2Util';
import {DavitButtonIcon} from '../../../../../common/fragments/buttons/DavitButton';
import {DavitMenuLabel} from '../../../../../common/fragments/DavitMenuLabel';
import {ActorDropDown} from '../../../../../common/fragments/dropdowns/ActorDropDown';
import {
  DataAndInstanceId, InstanceDropDownMultiselect,
} from '../../../../../common/fragments/dropdowns/InstanceDropDown';
import {ControllPanelEditSub} from '../common/ControllPanelEditSub';
import {OptionField} from '../common/OptionField';

export interface ControllPanelEditConditionProps {
  hidden: boolean;
}

export const ControllPanelEditCondition: FunctionComponent<ControllPanelEditConditionProps> = (props) => {
  const {hidden} = props;
  const {
    label,
    setMode,
    actorFk,
    setActorFk,
    setData,
    dataFks,
  } = useControllPanelEditConditionViewModel();

  return (
    <ControllPanelEditSub label={label} hidden={hidden} onClickNavItem={setMode}>
      <div className="optionFieldSpacer">
        <OptionField label="Select Actor">
          <ActorDropDown value={actorFk} onSelect={(actor) => setActorFk(actor?.actor.id || -1)} />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <DavitMenuLabel text="HAS"/>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="Select data for actor">
          <InstanceDropDownMultiselect
            onSelect={(data) => {
              setData(data);
            }}
            selected={dataFks || []}
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
  const decisionToEdit: DecisionTO | null = useSelector(editSelectors.decisionToEdit);
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Carv2Util.isNullOrUndefined(decisionToEdit)) {
      dispatch(handleError('Tried to go to edit decision without decisionToEdit specified'));
      dispatch(EditActions.setMode.edit());
    }
  }, [dispatch, decisionToEdit]);

  const setData = (dataAndInstanceIds: DataAndInstanceId[] | undefined) => {
    if (!Carv2Util.isNullOrUndefined(decisionToEdit)) {
      const copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.dataAndInstaceId = dataAndInstanceIds || [];
      dispatch(EditActions.decision.save(copyDecisionToEdit));
      dispatch(EditActions.decision.update(copyDecisionToEdit));
    }
  };

  const setMode = (newMode?: string) => {
    if (!Carv2Util.isNullOrUndefined(decisionToEdit)) {
      if (newMode && newMode === 'EDIT') {
        dispatch(EditActions.setMode.edit());
      } else if (newMode && newMode === 'SEQUENCE') {
        dispatch(EditActions.setMode.editSequence(selectedSequence?.sequenceTO.id));
      } else {
        dispatch(EditActions.setMode.editDecision(decisionToEdit!));
      }
    } else {
      console.info('decisionToEdit is null!');
    }
  };

  const setActorFk = (actorId: number) => {
    if (!Carv2Util.isNullOrUndefined(decisionToEdit)) {
      const copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.actorFk = actorId;
      dispatch(EditActions.decision.save(copyDecisionToEdit));
      dispatch(EditActions.decision.update(copyDecisionToEdit));
    }
  };

  return {
    label:
      'EDIT * ' + (selectedSequence?.sequenceTO.name || '') + ' * ' + (decisionToEdit?.name || '') + ' * CONDITION',
    setMode,
    actorFk: decisionToEdit?.actorFk,
    setActorFk,
    setData,
    dataFks: decisionToEdit?.dataAndInstaceId,
  };
};
