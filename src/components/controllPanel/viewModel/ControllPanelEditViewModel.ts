import { useDispatch } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { ComponentSlice } from "../../../viewModel/ComponentSlice";
import { DataSlice } from "../../../viewModel/DataSlice";
import { SequenceSlice } from "../../../viewModel/SequenceSlice";
import { globalSlice, Mode } from "../../common/viewModel/GlobalSlice";

export interface ControllPanelEditViewModel {
  createComponent: () => void;
  createData: () => void;
  createRelation: () => void;
  createSequence: () => void;
  selectComponent: (component: ComponentCTO | undefined) => void;
  selectData: (data: DataCTO | undefined) => void;
  selectRelation: (relation: DataRelationCTO | undefined) => void;
  selectSequence: (sequence: SequenceCTO | undefined) => void;
}

export const useControllPanelEditViewModel = (): ControllPanelEditViewModel => {
  const dispatch = useDispatch();

  const createComponent = (): void => {
    const component = new ComponentCTO();
    selectComponent(component);
  };

  const selectComponent = (component: ComponentCTO | undefined): void => {
    if (component !== undefined) {
      dispatch(ComponentSlice.actions.setCurrentComponent(component));
      dispatch(globalSlice.actions.setMode(Mode.EDIT_COMPONENT));
    } else {
      dispatch(ComponentSlice.actions.setCurrentComponent(null));
    }
  };

  const createData = (): void => {
    const data = new DataCTO();
    selectData(data);
  };

  const selectData = (data: DataCTO | undefined) => {
    if (data !== undefined) {
      dispatch(DataSlice.actions.setCurrentData(data));
      dispatch(globalSlice.actions.setMode(Mode.EDIT_DATA));
    } else {
      dispatch(DataSlice.actions.setCurrentData(null));
    }
  };

  const createRelation = (): void => {
    const relation = new DataRelationCTO();
    selectRelation(relation);
  };

  const selectRelation = (relation: DataRelationCTO | undefined) => {
    if (relation !== undefined) {
      dispatch(DataSlice.actions.setCurrentRelation(relation));
      dispatch(globalSlice.actions.setMode(Mode.EDIT_DATA_RELATION));
    } else {
      dispatch(DataSlice.actions.setCurrentRelation(null));
    }
  };

  const createSequence = () => {
    const sequence: SequenceCTO = new SequenceCTO();
    selectSequence(sequence);
  };

  const selectSequence = (sequence: SequenceCTO | undefined) => {
    if (sequence !== undefined) {
      dispatch(SequenceSlice.actions.setCurrentSequence(sequence));
      dispatch(globalSlice.actions.setMode(Mode.EDIT_SEQUENCE));
    } else {
      dispatch(SequenceSlice.actions.setCurrentSequence(null));
    }
  };

  return {
    createComponent,
    createData,
    createRelation,
    createSequence,
    selectComponent,
    selectData,
    selectRelation,
    selectSequence,
  };
};
