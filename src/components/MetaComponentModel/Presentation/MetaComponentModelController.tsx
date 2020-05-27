import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { currentComponent, selectComponents } from "../../../viewModel/ComponentSlice";
import { selectSequenceStepToEdit } from "../../controllPanel/viewModel/ControllPanelSlice";
import { MetaComponentActions } from "../viewModel/MetaComponentActions";
import { MetaComponentDnDBox } from "./fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (props) => {
  // TODO: solle vllt auch in ComponentSlice.
  const components: ComponentCTO[] = useSelector(selectComponents);
  const componentCTOToEdit: ComponentCTO | null = useSelector(currentComponent);
  const selectedStep: SequenceStepCTO | null = useSelector(selectSequenceStepToEdit);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(MetaComponentActions.findAllComponents());
  }, [dispatch]);

  const saveComp = (componentCTO: ComponentCTO) => {
    dispatch(MetaComponentActions.saveComponent(componentCTO));
  };

  const deleteComp = (id: number) => {
    const componentToDelete: ComponentCTO | undefined = components.find((component) => component.component.id === id);
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
