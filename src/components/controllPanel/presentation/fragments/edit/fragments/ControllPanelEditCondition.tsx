import React, {FunctionComponent, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Dropdown} from 'semantic-ui-react';
import {isNullOrUndefined} from 'util';
import {SequenceCTO} from '../../../../../../dataAccess/access/cto/SequenceCTO';
import {DecisionTO} from '../../../../../../dataAccess/access/to/DecisionTO';
import {EditActions, editSelectors} from '../../../../../../slices/EditSlice';
import {handleError} from '../../../../../../slices/GlobalSlice';
import {sequenceModelSelectors} from '../../../../../../slices/SequenceModelSlice';
import {Carv2Util} from '../../../../../../utils/Carv2Util';
import {Carv2ButtonIcon} from '../../../../../common/fragments/buttons/Carv2Button';
import {ActorDropDown} from '../../../../../common/fragments/dropdowns/ActorDropDown';
import {
  DataAndInstanceId,
  InstanceDropDownMultiselect,
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
    getDecision,
    setHas,
    setData,
    dataFks,
  } = useControllPanelEditConditionViewModel();

  const hasDropDown = (
    <OptionField label="Codition">
      <Dropdown
        options={[
          {key: 1, value: 1, text: 'has'},
          {key: 2, value: 2, text: 'has not'},
        ]}
        compact
        selection
        selectOnBlur={false}
        onChange={(event, data) => setHas(data.value as number)}
        value={getDecision()}
      />
    </OptionField>
  );

  return (
    <ControllPanelEditSub label={label} hidden={hidden} onClickNavItem={setMode}>
      <div className="optionFieldSpacer">
        <OptionField label="Select Actor">
          <ActorDropDown value={actorFk} onSelect={(actor) => setActorFk(actor?.actor.id || -1)} />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">{hasDropDown}</div>
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
          <Carv2ButtonIcon onClick={setMode} icon="reply" />
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
    if (isNullOrUndefined(decisionToEdit)) {
      dispatch(handleError('Tried to go to edit decision without decisionToEdit specified'));
      dispatch(EditActions.setMode.edit());
    }
  }, [dispatch, decisionToEdit]);

  const setData = (dataAndInstanceIds: DataAndInstanceId[] | undefined) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      const copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.dataAndInstaceId = dataAndInstanceIds || [];
      dispatch(EditActions.decision.save(copyDecisionToEdit));
      dispatch(EditActions.decision.update(copyDecisionToEdit));
    }
  };

  const setMode = (newMode?: string) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      if (newMode && newMode === 'EDIT') {
        dispatch(EditActions.setMode.edit());
      } else if (newMode && newMode === 'SEQUENCE') {
        dispatch(EditActions.setMode.editSequence(selectedSequence?.sequenceTO.id));
      } else {
        dispatch(EditActions.setMode.editDecision(decisionToEdit));
      }
    } else {
      console.info('decisionToEdit is null!');
    }
  };

  const setActorFk = (actorId: number) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      const copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.actorFk = actorId;
      dispatch(EditActions.decision.save(copyDecisionToEdit));
      dispatch(EditActions.decision.update(copyDecisionToEdit));
    }
  };

  // This is workaround sins redux seams to have a problem to save boolean values.
  const getDecision = (): number => {
    let hasNumber: number = 2;
    if (!isNullOrUndefined(decisionToEdit)) {
      hasNumber = decisionToEdit.has ? 1 : 2;
    }
    return hasNumber;
  };

  const setHas = (setHas: number | undefined) => {
    if (!isNullOrUndefined(decisionToEdit) && !isNullOrUndefined(setHas)) {
      const copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.has = setHas === 1 ? true : false;
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
    getDecision,
    setHas,
    setData,
    dataFks: decisionToEdit?.dataAndInstaceId,
  };
};
