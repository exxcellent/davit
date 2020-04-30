import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, Message, Transition } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../dataAccess/access/cto/SequenceStepCTO";
import { SequenceTO } from "../../dataAccess/access/to/SequenceTO";
import {
  selectGlobalErrorState,
  selectGlobalModeState,
  selectSequence,
  selectStep,
} from "../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "./viewModel/ControllPanelActions";
import { selectSequences } from "./viewModel/ControllPanelSlice";

export interface ControllPanelProps {}

export const ControllPanelController: FunctionComponent<ControllPanelProps> = (
  props
) => {
  const errorMessages: string[] = useSelector(selectGlobalErrorState);
  const operationMode = useSelector(selectGlobalModeState);
  const sequences: SequenceTO[] = useSelector(selectSequences);
  const sequence: SequenceCTO | undefined = useSelector(selectSequence);
  const step: SequenceStepCTO | undefined = useSelector(selectStep);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ControllPanelActions.findAllSequences());
  }, [dispatch]);

  const sequenceToOption = (sequence: SequenceTO) => {
    return {
      key: sequence.id,
      text: sequence.name,
      value: sequence.id,
    };
  };

  return (
    <div>
      <label> Mode: {operationMode}</label>
      <br />
      <Dropdown
        placeholder="Select Seqence"
        selection
        options={sequences.map(sequenceToOption)}
        onChange={(event, data) =>
          dispatch(ControllPanelActions.findSequence(Number(data.value)))
        }
      />
      {sequence && (
        <Button.Group>
          <Button icon="left arrow" />
          <Button.Or text={step?.step.index} />
          <Button
            icon="right arrow"
            isDisabled={isNullOrUndefined(sequence)}
            onClick={() => dispatch(ControllPanelActions.nextStep())}
          />
        </Button.Group>
      )}
      <label>current step: {step?.step.name}</label>

      <Transition
        visible={errorMessages.length > 0}
        animate="slide down"
        duration={500}
      >
        <Message error>
          <Message.Header>Error</Message.Header>
          <Button
            icon="close"
            size="mini"
            onClick={() => dispatch(ControllPanelActions.clearErrors())}
          />
          {errorMessages}
        </Message>
      </Transition>
    </div>
  );
};
