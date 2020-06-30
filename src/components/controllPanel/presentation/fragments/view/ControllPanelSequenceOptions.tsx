import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../dataAccess/access/cto/SequenceStepCTO";
import { DataSetupTO } from "../../../../../dataAccess/access/to/DataSetupTO";
import { SequenceTO } from "../../../../../dataAccess/access/to/SequenceTO";
import { SequenceModelActions, sequenceModelSelectors } from "../../../../../slices/SequenceModelSlice";
import { DataSetupDropDown } from "../../../../common/fragments/dropdowns/DataSetupDropDown";
import { SequenceDropDown } from "../../../../common/fragments/dropdowns/SequenceDropDown";
import { OptionField } from "../edit/common/OptionField";

export interface ControllPanelSequenceOptionsProps {}

export const ControllPanelSequenceOptions: FunctionComponent<ControllPanelSequenceOptionsProps> = (props) => {
  const {
    sequence,
    step,
    selectSequence,
    stepBack,
    stepNext,
    selectDataSetup,
  } = useControllPanelSequenceOptionsViewModel();

  return (
    <div className="controllPanelEdit">
      <div className="optionFieldSpacer">
        <OptionField label="Data - Setup">
          <DataSetupDropDown onSelect={selectDataSetup} placeholder="Select Data Setup ..." />
        </OptionField>
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
              onClick={stepBack}
            />
            <Button inverted color="orange" content={step?.squenceStepTO.index || 0} disabled={true} />
            <Button
              inverted
              color="orange"
              icon="right arrow"
              content="NEXT"
              labelPosition="right"
              disabled={isNullOrUndefined(sequence)}
              onClick={stepNext}
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

const useControllPanelSequenceOptionsViewModel = () => {
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const step: SequenceStepCTO | null = useSelector(sequenceModelSelectors.selectCurrentStep);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(MasterDataActions.loadSequencesFromBackend());
  // }, [dispatch]);

  const selectSequence = (sequence: SequenceTO | undefined) => {
    if (!isNullOrUndefined(sequence)) {
      dispatch(SequenceModelActions.setCurrentSequence(sequence.id));
    }
    if (sequence === undefined) {
      dispatch(SequenceModelActions.resetCurrentStepIndex);
      dispatch(SequenceModelActions.resetCurrentSequence);
    }
  };

  const selectDataSetup = (dataSetup: DataSetupTO | undefined): void => {
    if (isNullOrUndefined(dataSetup)) {
      dispatch(SequenceModelActions.resetCurrentDataSetup);
    } else {
      dispatch(SequenceModelActions.setCurrentDataSetup(dataSetup.id));
    }
  };

  // TODO: add in sequenceModelSlice.
  const stepNext = () => {};
  const stepBack = () => {};

  return {
    sequence,
    step,
    selectSequence,
    stepNext,
    stepBack,
    selectDataSetup,
  };
};
