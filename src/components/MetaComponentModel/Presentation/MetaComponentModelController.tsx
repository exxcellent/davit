import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { GroupTO } from "../../../dataAccess/access/to/GroupTO";
import { ComponentActions, currentComponent, selectComponents, selectGroups } from "../../../slices/ComponentSlice";
import { currentStep } from "../../../slices/SequenceSlice";
import { MetaComponentDnDBox } from "./fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (props) => {
  const { components, componentCTOToEdit, selectedStep, saveComp, groups } = useViewModel();

  return (
    <MetaComponentDnDBox
      componentCTOs={components}
      onSaveCallBack={saveComp}
      step={selectedStep}
      componentCTOToEdit={componentCTOToEdit}
      groups={groups}
    />
  );
};

const useViewModel = () => {
  const components: ComponentCTO[] = useSelector(selectComponents);
  const groups: GroupTO[] = useSelector(selectGroups);
  const componentCTOToEdit: ComponentCTO | null = useSelector(currentComponent);
  const selectedStep: SequenceStepCTO | null = useSelector(currentStep);
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
  };
};
