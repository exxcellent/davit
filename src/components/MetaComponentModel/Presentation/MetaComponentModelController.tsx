import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { ComponentDataCTO } from "../../../dataAccess/access/cto/ComponentDataCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { GroupTO } from "../../../dataAccess/access/to/GroupTO";
import { ComponentActions, currentComponent, selectComponents, selectGroups } from "../../../slices/ComponentSlice";
import { Mode, selectMode } from "../../../slices/GlobalSlice";
import { currentComponentDatas, currentStep } from "../../../slices/SequenceSlice";
import { MetaComponentDnDBox } from "./fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (props) => {
  const { components, componentCTOToEdit, selectedStep, saveComp, groups, componentDatas } = useViewModel();

  return (
    <MetaComponentDnDBox
      componentCTOs={components}
      onSaveCallBack={saveComp}
      step={selectedStep}
      componentCTOToEdit={componentCTOToEdit}
      groups={groups}
      componentDatas={componentDatas}
    />
  );
};

const useViewModel = () => {
  const components: ComponentCTO[] = useSelector(selectComponents);
  const groups: GroupTO[] = useSelector(selectGroups);
  const componentCTOToEdit: ComponentCTO | null = useSelector(currentComponent);
  const selectedStep: SequenceStepCTO | null = useSelector(currentStep);
  const mode: Mode = useSelector(selectMode);
  const componentDatas: ComponentDataCTO[] = useSelector(currentComponentDatas);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(ComponentActions.loadComponentsFromBackend());
    dispatch(ComponentActions.loadGroupsFromBackend());
  }, [dispatch]);

  const saveComp = (componentCTO: ComponentCTO) => {
    dispatch(ComponentActions.saveComponent(componentCTO));
  };

  return {
    components,
    componentCTOToEdit,
    selectedStep,
    saveComp,
    groups,
    componentDatas: (mode === Mode.EDIT_SEQUENCE_STEP_ACTION ? selectedStep?.actions : componentDatas) || [],
  };
};
