import React, { FunctionComponent } from "react";
import { MetaComponentDnDBox } from "./Fragments/MetaComponentDnDBox";
import { ComponentCTO } from "../../../dataAccess/ComponentCTO";
import ComponentTO from "../../../dataAccess/ComponentTO";
import GeometricalDataTO from "../../../dataAccess/GeometricalDataTO";
import PositionTO from "../../../dataAccess/PositionTO";
import DesignTO from "../../../dataAccess/DesignTO";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (
  props
) => {
  console.info("render Controller.");

  const comp1 = {
    component: ComponentTO.builder().name("comp1").id(1).build(),
    geometricalData: GeometricalDataTO.builder().build(),
    position: PositionTO.builder().build(),
    design: DesignTO.builder().build(),
  };
  const comp2 = {
    component: ComponentTO.builder().name("comp2").id(2).build(),
    geometricalData: GeometricalDataTO.builder().build(),
    position: PositionTO.builder().y(300).build(),
    design: DesignTO.builder().build(),
  };
  const comp3 = {
    component: ComponentTO.builder().name("comp3").id(3).build(),
    geometricalData: GeometricalDataTO.builder().build(),
    position: PositionTO.builder().y(300).x(300).build(),
    design: DesignTO.builder().build(),
  };
  const comp4 = {
    component: ComponentTO.builder().name("comp4").id(4).build(),
    geometricalData: GeometricalDataTO.builder().build(),
    position: PositionTO.builder().x(300).build(),
    design: DesignTO.builder().build(),
  };

  // const componentCTOs: ComponentCTO[] = [comp1, comp2, comp3, comp4];
  const [componentCTOs, setComponentCTOs] = React.useState<ComponentCTO[]>([
    comp1,
    comp2,
    comp3,
    comp4,
  ]);

  console.log(JSON.stringify(componentCTOs));

  const createNewComponent = () => {
    const comp = {
      component: ComponentTO.builder().build(),
      geometricalData: GeometricalDataTO.builder().build(),
      position: PositionTO.builder().build(),
      design: DesignTO.builder().build(),
    };
    setComponentCTOs([...componentCTOs, comp]);
    console.log("Add Component to componentCTOs!");
    console.info(componentCTOs);
  };
  // const updateComponent = (
  //   componentName: string,
  //   componentId: number,
  //   componentColor: string
  // ) => {
  //   console.info(
  //     "updateComponent: Name: " + componentName + ", id: " + componentId
  //   );
  //   setAddPopupvisible(false);
  //   if (componentId > 0) {
  //     console.info(component);
  //     dispatch(
  //       deleteComponent({
  //         compName: componentName,
  //         id: componentId,
  //         color: componentColor,
  //       })
  //     );
  //     dispatch(
  //       addComponent({
  //         compName: componentName,
  //         id: componentId,
  //         color: componentColor,
  //       })
  //     );

  //     setIdCounter(idCounter + 1);
  //   }
  // };

  return (
    <div>
      <button onClick={createNewComponent}>Add</button>
      <MetaComponentDnDBox componentCTOs={componentCTOs} />
    </div>
  );
};

// ---------- Styling ----------
