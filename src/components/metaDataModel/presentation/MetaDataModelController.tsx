import React, { FunctionComponent } from "react";

interface MetaDataModelControllerProps {}

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = () => {
  //   const components: ComponentCTO[] = useSelector(selectComponents);
  //   const selectedStep: SequenceStepCTO | undefined = useSelector(selectStep);
  //   const dispatch = useDispatch();

  //   React.useEffect(() => {
  //     dispatch(MetaComponentActions.findAllComponents());
  //   }, [dispatch]);

  //   const createNewComponent = () => {
  //     dispatch(MetaComponentActions.saveComponent(new ComponentCTO()));
  //   };

  //   const saveComp = (componentCTO: ComponentCTO) => {
  //     dispatch(MetaComponentActions.saveComponent(componentCTO));
  //   };

  //   const deleteComp = (id: number) => {
  //     const componentToDelete: ComponentCTO | undefined = components.find(
  //       (component) => component.component.id === id
  //     );
  //     if (componentToDelete) {
  //       dispatch(MetaComponentActions.deleteComponent(componentToDelete));
  //     }
  //   };

  return (
    <div>
      <label>Data Model</label>
    </div>
  );
};
