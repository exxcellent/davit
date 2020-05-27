import { useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { currentComponent } from "../../../viewModel/ComponentSlice";
import { currentData, currentRelation } from "../../../viewModel/DataSlice";
import { currentSequence, currentStep } from "../../../viewModel/SequenceSlice";
import { globalSlice, Mode, selectMode } from "../../common/viewModel/GlobalSlice";

export const ControllPanelViewModel = {
  setMode(mode: Mode) {
    globalSlice.actions.setMode(mode);
  },

  useGetMode(): Mode {
    return useSelector(selectMode);
  },

  useGetComponent(): ComponentCTO | null {
    return useSelector(currentComponent);
  },

  useGetData(): DataCTO | null {
    return useSelector(currentData);
  },

  useGetRelation(): DataRelationCTO | null {
    return useSelector(currentRelation);
  },

  useGetSequence(): SequenceCTO | null {
    return useSelector(currentSequence);
  },

  useGetStep(): SequenceStepCTO | null {
    return useSelector(currentStep);
  },
};
