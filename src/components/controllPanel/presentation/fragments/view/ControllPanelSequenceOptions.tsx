import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { SequenceTO } from "../../../../../dataAccess/access/to/SequenceTO";
import {
  selectSequence,
  selectStep,
} from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { selectSequences } from "../../../viewModel/ControllPanelSlice";
import "./ControllPanelSequenceOptions.css";

export interface ControllPanelSequenceOptionsProps {}

export const ControllPanelSequenceOptions: FunctionComponent<ControllPanelSequenceOptionsProps> = (
  props
) => {
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
    <div className="controllPanelView">
      <div className="controllPanelViewChild">
        <Dropdown
          placeholder="Select Seqence"
          selection
          options={sequences.map(sequenceToOption)}
          onChange={(event, data) =>
            dispatch(ControllPanelActions.findSequence(Number(data.value)))
          }
        />
      </div>
      <div className="controllPanelViewChild">
        <Button.Group>
          <Button
            icon="left arrow"
            content="BACK"
            labelPosition="left"
            disabled={isNullOrUndefined(sequence)}
            onClick={() => dispatch(ControllPanelActions.previousStep())}
          />
          <Button.Or text={step?.squenceStepTO.index} />
          <Button
            icon="right arrow"
            content="NEXT"
            labelPosition="right"
            disabled={isNullOrUndefined(sequence)}
            onClick={() => dispatch(ControllPanelActions.nextStep())}
          />
        </Button.Group>
      </div>
    </div>
  );
};
