import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataSetupCTO } from "../../../../../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../../../../../dataAccess/access/cto/SequenceCTO";
import { DataSetupTO } from "../../../../../dataAccess/access/to/DataSetupTO";
import { SequenceTO } from "../../../../../dataAccess/access/to/SequenceTO";
import { SequenceModelActions, sequenceModelSelectors } from "../../../../../slices/SequenceModelSlice";
import { DataSetupDropDown } from "../../../../common/fragments/dropdowns/DataSetupDropDown";
import { SequenceDropDown } from "../../../../common/fragments/dropdowns/SequenceDropDown";
import { ControllPanelEditSub } from "../edit/common/ControllPanelEditSub";
import { OptionField } from "../edit/common/OptionField";

export interface ControllPanelSequenceOptionsProps {}

export const ControllPanelSequenceOptions: FunctionComponent<ControllPanelSequenceOptionsProps> = (props) => {
  const {
    sequence,
    stepIndex,
    selectSequence,
    stepBack,
    stepNext,
    selectDataSetup,
    currentDataSetup,
    currentSequence,
  } = useControllPanelSequenceOptionsViewModel();

  return (
    <ControllPanelEditSub label="VIEW">
      <div className="optionFieldSpacer">
        <OptionField label="Data - Setup">
          <DataSetupDropDown onSelect={selectDataSetup} placeholder="Select Data Setup ..." value={currentDataSetup} />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="SEQUENCE">
          <SequenceDropDown onSelect={selectSequence} value={currentSequence} />
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
            <Button inverted color="orange" content={stepIndex || 0} disabled={true} />
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
    </ControllPanelEditSub>
  );
};

const useControllPanelSequenceOptionsViewModel = () => {
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
  const selectedDataSetup: DataSetupCTO | null = useSelector(sequenceModelSelectors.selectDataSetup);
  const dispatch = useDispatch();

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

  const stepBack = () => {
    if (!isNullOrUndefined(sequence)) {
      dispatch(SequenceModelActions.stepBack(stepIndex));
    }
  };

  const stepNext = () => {
    if (!isNullOrUndefined(sequence)) {
      dispatch(SequenceModelActions.stepNext(stepIndex));
    }
  };

  return {
    sequence,
    stepIndex,
    selectSequence,
    stepNext,
    stepBack,
    selectDataSetup,
    currentDataSetup: selectedDataSetup?.dataSetup.id || -1,
    currentSequence: sequence?.sequenceTO.id || -1,
  };
};
