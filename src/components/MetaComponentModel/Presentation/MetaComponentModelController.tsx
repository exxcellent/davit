import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { selectStep } from "../../common/viewModel/GlobalSlice";
import { selectComponentToEdit } from "../../controllPanel/viewModel/ControllPanelSlice";
import { MetaComponentActions } from "../viewModel/MetaComponentActions";
import { selectComponents } from "../viewModel/MetaComponentModelSlice";
import { MetaComponentDnDBox } from "./fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (
  props
) => {
  const components: ComponentCTO[] = useSelector(selectComponents);
  const componentCTOToEdit: ComponentCTO | null = useSelector(
    selectComponentToEdit
  );
  const selectedStep: SequenceStepCTO | undefined = useSelector(selectStep);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(MetaComponentActions.findAllComponents());
  }, [dispatch]);

  const saveComp = (componentCTO: ComponentCTO) => {
    dispatch(MetaComponentActions.saveComponent(componentCTO));
  };

  const deleteComp = (id: number) => {
    const componentToDelete: ComponentCTO | undefined = components.find(
      (component) => component.component.id === id
    );
    if (componentToDelete) {
      dispatch(MetaComponentActions.deleteComponent(componentToDelete));
    }
  };

  const createMetaComponentDnDBox = () => {
    return (
      <MetaComponentDnDBox
        componentCTOs={components}
        onSaveCallBack={saveComp}
        onDeleteCallBack={deleteComp}
        step={selectedStep}
        componentCTOToEdit={componentCTOToEdit}
      />
    );
  };

  return createMetaComponentDnDBox();
};
