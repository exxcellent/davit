import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ActionCTO } from "../../../dataAccess/access/cto/ActionCTO";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { ComponentDataCTO } from "../../../dataAccess/access/cto/ComponentDataCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { GroupTO } from "../../../dataAccess/access/to/GroupTO";
import { ComponentActions, currentComponent, selectComponents, selectGroups } from "../../../slices/ComponentSlice";
import { Mode, selectMode } from "../../../slices/GlobalSlice";
import { currentActionToEdit, currentComponentDatas, currentStep } from "../../../slices/SequenceSlice";
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
      componentDatas={getComponentDatas()}
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
  const action: ActionCTO | null = useSelector(currentActionToEdit);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(ComponentActions.loadComponentsFromBackend());
    dispatch(ComponentActions.loadGroupsFromBackend());
  }, [dispatch]);

  const saveComp = (componentCTO: ComponentCTO) => {
    dispatch(ComponentActions.saveComponent(componentCTO));
  };

  const getComponentDatas = (): (ComponentDataCTO | ActionCTO)[] => {
    if (!isNullOrUndefined(selectedStep))
      if (mode === Mode.EDIT_SEQUENCE_STEP || mode === Mode.VIEW) {
        // TODO: seperate this cases when SequenceActionReducer exists!
        return selectedStep.actions;
      }
    if (mode === Mode.EDIT_SEQUENCE_STEP_ACTION && !isNullOrUndefined(action)) {
      return [action];
    }
    return componentDatas;
  };

  return {
    components,
    componentCTOToEdit,
    selectedStep,
    saveComp,
    groups,
    getComponentDatas,
  };
};
