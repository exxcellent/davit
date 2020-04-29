import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { selectStep } from "../../common/viewModel/GlobalSlice";
import { MetaComponentActions } from "../ViewModel/MetaComponentActions";
import { selectComponents } from "../ViewModel/MetaComponentModelSlice";
import { MetaComponentDnDBox } from "./Fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = () => {
  console.info("render Controller.");

  const components: ComponentCTO[] = useSelector(selectComponents);
  const selectedStep: SequenceStepCTO | undefined = useSelector(selectStep);
  const dispatch = useDispatch();

  React.useEffect(() => {
    console.info("trigerrrer use Effect");
    dispatch(MetaComponentActions.findAllComponents());
  }, [dispatch]);

  const createNewComponent = () => {
    dispatch(MetaComponentActions.saveComponent(new ComponentCTO()));
  };

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
      />
    );
  };

  // // TODO only for testing.
  // const [steps, setSteps] = React.useState<SequenceStepCTO[]>([]);

  // useEffect(() => {
  //   if (components.length >= 2) {
  //     setSteps([
  //       new SequenceStepCTO(
  //         components[0],
  //         components[1],
  //         new SequenceStepTO()
  //       ),
  //     ]);
  //   }
  // }, [setSteps, components]);

  return (
    <div>
      <button onClick={createNewComponent}>Add</button>
      {createMetaComponentDnDBox()}
    </div>
  );
};

// ---------- Styling ----------
