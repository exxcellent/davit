import { Button, Select } from "@chakra-ui/core";
import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../dataAccess/access/cto/SequenceStepCTO";
import { SequenceTO } from "../../dataAccess/access/to/SequenceTO";
import {
  selectGlobalErrorState,
  selectGlobalModeState,
  selectSequence,
  selectStep,
  switchMode,
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

  const changeMode = () => {
    dispatch(switchMode());
  };

  useEffect(() => {
    dispatch(ControllPanelActions.findAllSequences());
  }, [dispatch]);

  const sequenceToOption = (sequence: SequenceTO) => {
    return (
      <option key={sequence.id} value={sequence.id}>
        {sequence.name}
      </option>
    );
  };

  return (
    <div>
      <button onClick={changeMode}>Switch</button>
      <label> Mode: {operationMode}</label>
      <br />
      {/* <div id="messageLabel">{errorMessages[errorMessages.length - 1]}</div> */}
      <div id="messageLabel">{errorMessages}</div>
      <Select
        placeholder="Select option"
        onChange={(event) =>
          dispatch(
            ControllPanelActions.findSequence(Number(event.target.value))
          )
        }
      >
        {sequences.map(sequenceToOption)}
      </Select>
      <label>current sequence: {sequence?.sequenceTO.name}</label>
      <label>current step: {step?.step.name}</label>
      <Button isDisabled={isNullOrUndefined(sequence)}>{"<="}</Button>
      <Button
        isDisabled={isNullOrUndefined(sequence)}
        onClick={() => dispatch(ControllPanelActions.nextStep())}
      >
        {"=>"}
      </Button>
    </div>
  );
};
