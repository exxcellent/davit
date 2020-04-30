import { AppThunk } from "../../../app/store";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";
import { DataAccess } from "../../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../../dataAccess/DataAccessResponse";
import { globalSlice, handleError } from "../../common/viewModel/GlobalSlice";
import { ControllPanelSlice } from "./ControllPanelSlice";

const { loadSequences } = ControllPanelSlice.actions;
const { setSequence } = globalSlice.actions;
const { nextStep } = globalSlice.actions;
const { clearErrors } = globalSlice.actions;

const findAllSequences = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<
    SequenceTO[]
  > = await DataAccess.findAllSequences();
  if (response.code === 200) {
    dispatch(loadSequences(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const findSequence = (sequenceId: number): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceCTO> = await DataAccess.findSequence(
    sequenceId
  );
  if (response.code === 200) {
    dispatch(setSequence(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

export const ControllPanelActions = {
  findAllSequences,
  findSequence,
  nextStep,
  clearErrors,
};
