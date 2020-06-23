import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { currentSequence, currentStep, SequenceActions, SequenceSlice } from "../../../../../slices/SequenceSlice";
import { SequenceDropDown } from "../edit/common/fragments/dropdowns/SequenceDropDown";
import { OptionField } from "../edit/common/OptionField";

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
      dispatch(SequenceSlice.actions.resetCurrentStepIndex());
      dispatch(SequenceActions.setSequenceToEdit(sequence));
    }
    if (sequence === undefined) {
      dispatch(SequenceSlice.actions.resetCurrentStepIndex());
      dispatch(SequenceSlice.actions.resetCurrentSequence());
    }
  };

  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <OptionField></OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="SEQUENCE">
          <SequenceDropDown onSelect={selectSequence} placeholder="Select Sequence" />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="STEP">
          <Button.Group inverted color="orange">
            <Button
              inverted
              color="orange"
              icon="left arrow"
              content="BACK"
              labelPosition="left"
              disabled={isNullOrUndefined(sequence)}
              onClick={() => dispatch(SequenceSlice.actions.setPreviousStepToCurrentStep())}
            />
            <Button inverted color="orange" content={step?.squenceStepTO.index || 0} disabled={true} />
            <Button
              inverted
              color="orange"
              icon="right arrow"
              content="NEXT"
              labelPosition="right"
              disabled={isNullOrUndefined(sequence)}
              onClick={() => dispatch(SequenceSlice.actions.setNextStepToCurrentStep())}
            />
          </Button.Group>
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField></OptionField>
      </div>
    </div>
  );
};
