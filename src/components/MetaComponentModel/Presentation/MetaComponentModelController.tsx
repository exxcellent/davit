import React, { FunctionComponent } from "react";
import { MetaComponentFragment } from "./Fragments/MetaComponentFragment";
import { useDispatch, useSelector } from "react-redux";
import {
  selectComponents,
  addComponent,
  deleteComponent,
} from "../ViewModel/MetaComponentModelSlice";
import styled from "styled-components";
import { MetaComponentAddPopup } from "./Fragments/MetaComponentAddPopup";
import { CarvButton } from "../../common/styles/Button";
import ComponentTO from "../../../dataAccess/ComponentTO";
import { isNullOrUndefined } from "util";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (
  props
) => {
  const dispatch = useDispatch();
  const components = useSelector(selectComponents);
  const [addPopupVisible, setAddPopupvisible] = React.useState<boolean>(false);
  const [component, setComponent] = React.useState<ComponentTO>(
    ComponentTO.builder().build()
  );

  const openPopup = (component: ComponentTO) => {
    setComponent(component);
    setAddPopupvisible(true);
  };

  const updateComponent = (
    componentName: string,
    componentId: number,
    componentColor = "yellow"
  ) => {
    setAddPopupvisible(false);
    setComponent(ComponentTO.builder().build());
    // do nothing if no id was set.
    if (!isNullOrUndefined(componentId)) {
      let component = ComponentTO.builder().build();
      component = ComponentTO.builder(component).name(componentName).build();
      component = ComponentTO.builder(component).id(componentId).build();

      dispatch(deleteComponent(component));
      dispatch(addComponent(component));
    }
  };

  return (
    <DataModelFrame>
      <CarvButton
        name="Add Button"
        icon="plus-square"
        onClickCallback={() => openPopup(component)}
      />
      <ComponentContainer>
        {components.map((component: ComponentTO, index: number) => {
          return (
            <MetaComponentFragment
              key={index}
              {...component}
              editCallBack={() => openPopup(component)}
            />
          );
        })}
      </ComponentContainer>
      {addPopupVisible && (
        <MetaComponentAddPopup
          component={component}
          onCallBack={updateComponent}
        />
      )}
    </DataModelFrame>
  );
};

// ---------- Styling ----------
const ComponentContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DataModelFrame = styled.div`
  margin: 15px;
`;
