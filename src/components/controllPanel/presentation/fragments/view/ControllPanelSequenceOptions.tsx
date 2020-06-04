import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { currentSequence, currentStep, SequenceActions, SequenceSlice } from "../../../../../slices/SequenceSlice";
import { useGetSequenceDropdown } from "../edit/common/fragments/Carv2DropDown";
import "./ControllPanelSequenceOptions.css";

export interface ControllPanelSequenceOptionsProps {}

export const ControllPanelSequenceOptions: FunctionComponent<ControllPanelSequenceOptionsProps> = (props) => {
  const sequence: SequenceCTO | null = useSelector(currentSequence);
  const step: SequenceStepCTO | null = useSelector(currentStep);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SequenceActions.loadSequencesFromBackend());
  }, [dispatch]);

  const selectSequence = (sequence: SequenceCTO | undefined) => {
    if (!isNullOrUndefined(sequence)) {
      dispatch(SequenceActions.setSequenceToEdit(sequence));
    }
  };

  return (
    <div className="controllPanelView">
      <div className="controllPanelViewChild">
        {/* TODO: Dropdown schön machen! */}
        {useGetSequenceDropdown((sequence) => selectSequence(sequence))}
      </div>
      <div className="controllPanelViewChild">
        <Button.Group inverted color="orange">
          <Button
            inverted
            color="orange"
            icon="left arrow"
            content="BACK"
            labelPosition="left"
            // TODO: Button function hinzufügen.
            // disabled={isNullOrUndefined(sequence)}
            disabled={true}
            // previousStep method neu schreiben.
            // onClick={() => dispatch(SequenceSlice.actions.getNextStepFormCurrentSequence())}
          />
          <Button inverted color="orange" content={step?.squenceStepTO.index || 0} disabled={true} />
          <Button
            inverted
            color="orange"
            icon="right arrow"
            content="NEXT"
            labelPosition="right"
            disabled={isNullOrUndefined(sequence)}
            // TODO: action in SequenceAction umlagern.
            onClick={() => dispatch(SequenceSlice.actions.getNextStepFormCurrentSequence())}
          />
        </Button.Group>
      </div>
    </div>
  );
};
