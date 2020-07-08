import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { GroupTO } from "../../../dataAccess/access/to/GroupTO";
import { EditActions, editSelectors, Mode } from "../../../slices/EditSlice";
import { MasterDataActions, masterDataSelectors } from "../../../slices/MasterDataSlice";
import { sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { ComponentDataFragmentProps } from "../../../viewDataTypes/ComponentDataFragment";
import { MetaComponentDnDBox } from "./fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (props) => {
  const { components, getStep, saveComp, groups, getComponentDatas, componentCTOToEdit } = useViewModel();

  return (
    <MetaComponentDnDBox
      componentCTOs={components}
      onSaveCallBack={saveComp}
      step={getStep()}
      componentCTOToEdit={componentCTOToEdit}
      groups={groups}
      componentDatas={getComponentDatas()}
    />
  );
};

const useViewModel = () => {
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const groups: GroupTO[] = useSelector(masterDataSelectors.groups);
  const componentCTOToEdit: ComponentCTO | null = useSelector(editSelectors.componentToEdit);
  const selectedStep: SequenceStepCTO | null = useSelector(sequenceModelSelectors.selectCurrentStep);
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  // const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const mode: Mode = useSelector(editSelectors.mode);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(MasterDataActions.loadComponentsFromBackend());
    dispatch(MasterDataActions.loadGroupsFromBackend());
  }, [dispatch]);

  const saveComp = (componentCTO: ComponentCTO) => {
    dispatch(EditActions.component.save(componentCTO));
  };

  const getStep = (): SequenceStepCTO | null => {
    let step: SequenceStepCTO | null = null;
    if (mode.startsWith("EDIT")) {
      step = stepToEdit;
    }
    if (mode.startsWith("VIEW")) {
      step = selectedStep;
    }
    return step;
  };

  const getComponentDatas = (): ComponentDataFragmentProps[] => {
    let compDatas: ComponentDataFragmentProps[] = [];
    if (mode === Mode.EDIT_SEQUENCE_STEP_ACTION) {
      // if (!isNullOrUndefined(actionToEdit)) {
      //   // TODO: map action to componentDataFragment.
      // }
    }
    return compDatas;
  };

  return {
    components,
    componentCTOToEdit,
    getStep,
    saveComp,
    groups,
    getComponentDatas,
  };
};
