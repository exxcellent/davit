import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from 'semantic-ui-react';
import {SequenceCTO} from '../../../dataAccess/access/cto/SequenceCTO';
import {Terminal} from '../../../dataAccess/access/types/GoToType';
import {CalculatedStep} from '../../../services/SequenceService';
import {SequenceModelActions, sequenceModelSelectors} from '../../../slices/SequenceModelSlice';
import {DavitTableRowData} from '../../common/fragments/DavitTable';

export const useGetCalcSequenceTableData = (calcSteps: CalculatedStep[], selectedSequence: SequenceCTO | null) => {
  const dispatch=useDispatch();

  const terminalStep: Terminal | null = useSelector(
      sequenceModelSelectors.selectTerminalStep,
  );
  const loopStepStartIndex: number | null = useSelector(
      sequenceModelSelectors.selectLoopStepStartIndex,
  );

  const stepIndex: number | null = useSelector(
      sequenceModelSelectors.selectCurrentStepIndex,
  );

  const bodyData: DavitTableRowData[] = calcSteps.map((step, index) =>{
    const onClick = ()=> dispatch(SequenceModelActions.setCurrentStepIndex(index));

    return createCalcSequenceStepColumn(selectedSequence, step, index, stepIndex, loopStepStartIndex, onClick, terminalStep);
  });
  // if (terminalStep) {
  //   bodyData.push(createTerminalColumn(terminalStep));
  // }
  return {
    header,
    bodyData,
  };
};

const header = [
  'INDEX',
  'NAME',
  'TYPE',
  'ACTION-ERROR',
];

const createCalcSequenceStepColumn = (selectedSequence: SequenceCTO | null, step: CalculatedStep, index: number,
    stepIndex: number, loopStepStartIndex: number | null, clickEvent: ()=>void, terminal: Terminal | null): DavitTableRowData => {
  let trClass: string
      = loopStepStartIndex && loopStepStartIndex <= index
        ? 'carv2TrTerminalError'
        : 'carv2Tr';

  if (step.type === 'TERMINAL' && terminal) {
    trClass = 'carv2TrTerminal' + terminal.type;
  }

  if (index === stepIndex) {
    if (step.type === 'TERMINAL') {
      trClass = trClass + ' ' + 'davitTrTerminalMarked';
    } else {
      trClass = 'carv2TrMarked';
    }
  }

  const hasError = step.errors.length > 0 ? true : false;

  return {
    actions: [],
    data: [index.toString(), getModelElementName(step, selectedSequence, terminal), step.type, hasError ? getWarningIcon() : ''],
    trClass: 'clickable ' + trClass,
    onClick: clickEvent,
  };
};

const getWarningIcon = () : JSX.Element => {
  return (<Icon name="warning sign" color="red" />);
};

function getModelElementName(step: CalculatedStep, selectSequence: SequenceCTO | null, terminal: Terminal | null) {
  switch (step.type) {
    case 'STEP':
      return selectSequence?.sequenceStepCTOs.find(
          (item) => item.squenceStepTO.id === step.modelElementFk
          )?.squenceStepTO.name || 'Step not found!';
    case 'DECISION':
      return selectSequence?.decisions.find(
          (item) => item.id === step.modelElementFk
          )?.name || 'Decision not found!';
    case 'INIT':
      return 'Initial step';
    case 'TERMINAL':
      return terminal?.type || `Terminal name not found!`;
    default:
      return `ModelElement type has type ${step.type} which is not known`;
  }
}

const createTerminalColumn = (terminal: Terminal): DavitTableRowData => {
  const className = 'carv2TrTerminal' + terminal.type;
  return {
    data: ['', terminal.type, '', ''],
    actions: [],
    trClass: className,
  };
};
