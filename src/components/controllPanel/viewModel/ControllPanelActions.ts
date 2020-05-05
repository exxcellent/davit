import { AppThunk } from "../../../app/store";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";
import { DataAccess } from "../../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../../dataAccess/DataAccessResponse";
import { globalSlice, handleError } from "../../common/viewModel/GlobalSlice";
import { metaComponentModelSlice } from "../../metaComponentModel/viewModel/MetaComponentModelSlice";
import { ControllPanelSlice } from "./ControllPanelSlice";

const { loadSequences } = ControllPanelSlice.actions;
const { setSequence } = globalSlice.actions;
const { nextStep } = globalSlice.actions;
const { clearErrors } = globalSlice.actions;
const { loadComponents } = metaComponentModelSlice.actions;

// TODO: vllt nochmal aufteilen in Option parts.

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

const findAllComponents = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<
    ComponentCTO[]
  > = await DataAccess.findAllComponents();
  if (response.code === 200) {
    dispatch(loadComponents(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const saveComponent = (component: ComponentCTO): AppThunk => async (
  dispatch
) => {
  const response: DataAccessResponse<ComponentCTO> = await DataAccess.saveComponentCTO(
    component
  );
  console.log(response);
  if (response.code === 200) {
    dispatch(findAllComponents());
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
  saveComponent,
};
