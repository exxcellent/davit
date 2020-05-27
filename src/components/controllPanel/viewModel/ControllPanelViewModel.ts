import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { ComponentSlice, currentComponent } from "../../../viewModel/ComponentSlice";
import { currentData, currentRelation } from "../../../viewModel/DataSlice";
import { currentSequence, currentStep } from "../../../viewModel/SequenceSlice";
import { globalSlice, Mode, selectMode } from "../../common/viewModel/GlobalSlice";

export interface ControllPanelViewModel {
  mode: Mode;
  component: ComponentCTO | null;
  data: DataCTO | null;
  relation: DataRelationCTO | null;
  sequence: SequenceCTO | null;
  step: SequenceStepCTO | null;
}

export const useControllPanelViewModel = (): ControllPanelViewModel => {
  const dispatch = useDispatch();

  const setMode = (mode: Mode) => {
    dispatch(globalSlice.actions.setMode(mode));
  };

  const mode: Mode = useSelector(selectMode);
  const component: ComponentCTO | null = useSelector(currentComponent);
  const data: DataCTO | null = useSelector(currentData);
  const relation: DataRelationCTO | null = useSelector(currentRelation);
  const sequence: SequenceCTO | null = useSelector(currentSequence);
  const step: SequenceStepCTO | null = useSelector(currentStep);

  const createNewComponent = (): void => {
    console.info("create new component");
    const newComponent = new ComponentCTO();
    dispatch(ComponentSlice.actions.setCurrentComponent(newComponent));
    dispatch(globalSlice.actions.setMode(Mode.EDIT_COMPONENT));
  };

  const editComponent = (component: ComponentCTO): void => {
    dispatch(ComponentSlice.actions.setCurrentComponent(component));
    dispatch(globalSlice.actions.setMode(Mode.EDIT_COMPONENT));
  };

  return { mode, component, data, relation, sequence, step };
};
