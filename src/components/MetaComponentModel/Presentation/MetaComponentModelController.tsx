import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { GroupTO } from "../../../dataAccess/access/to/GroupTO";
import { ComponentActions } from "../../../slices/ComponentSlice";
import { editSelectors } from "../../../slices/EditSlice";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { MetaComponentDnDBox } from "./fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (props) => {
  const { components, componentCTOToEdit, selectedStep, saveComp, groups, getComponentDatas } = useViewModel();

  return (
    <MetaComponentDnDBox
      componentCTOs={components}
      onSaveCallBack={saveComp}
      step={selectedStep}
      componentCTOToEdit={componentCTOToEdit}
      groups={groups}
      componentDatas={getComponentDatas}
    />
  );
};

const useViewModel = () => {
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const groups: GroupTO[] = useSelector(masterDataSelectors.groups);
  const componentCTOToEdit: ComponentCTO | null = useSelector(editSelectors.componentToEdit);
  const selectedStep: SequenceStepCTO | null = useSelector(sequenceModelSelectors.selectCurrentStep);
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
    getComponentDatas: [],
  };
};
