import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { currentSequence, currentStep } from "../../../../../slices/SequenceSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import "./ControllPanelSequenceOptions.css";

export interface ControllPanelSequenceOptionsProps {}

export const ControllPanelSequenceOptions: FunctionComponent<ControllPanelSequenceOptionsProps> = (props) => {
  const sequences: SequenceCTO[] = [];
  const sequence: SequenceCTO | null = useSelector(currentSequence);
  const step: SequenceStepCTO | null = useSelector(currentStep);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ControllPanelActions.findAllSequences());
  }, [dispatch]);

  const sequenceToOption = (sequence: SequenceCTO) => {
    return {
      key: sequence.sequenceTO.id,
      text: sequence.sequenceTO.name,
      value: sequence.sequenceTO.id,
    };
  };

  return (
    <div className="controllPanelView">
      <div className="controllPanelViewChild">
        <Dropdown
          placeholder="Select Seqence"
          selection
          options={sequences.map(sequenceToOption)}
          onChange={(event, data) => dispatch(ControllPanelActions.findSequence(Number(data.value)))}
        />
      </div>
      <div className="controllPanelViewChild">
        <Button.Group inverted color="orange">
          <Button
            inverted
            color="orange"
            icon="left arrow"
            content="BACK"
            labelPosition="left"
            disabled={isNullOrUndefined(sequence)}
            // previousStep method neu schreiben.
            // onClick={() => dispatch(ControllPanelActions.previousStep())}
          />
          <Button inverted color="orange" content={step?.squenceStepTO.index || 0} disabled={true} />
          <Button
            inverted
            color="orange"
            icon="right arrow"
            content="NEXT"
            labelPosition="right"
            disabled={isNullOrUndefined(sequence)}
            // nextStep method neu schreiben.
            // onClick={() => dispatch(ControllPanelActions.nextStep())}
          />
        </Button.Group>
      </div>
    </div>
  );
};
