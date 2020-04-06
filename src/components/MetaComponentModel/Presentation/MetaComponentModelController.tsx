import React, { FunctionComponent } from "react";
import { MetaComponentFragment } from "../../common/MetaComponentFragment";
import { ComponentTo } from "../access/ComponentTo";
import { useDispatch, useSelector } from "react-redux";
import {
  selectComponents,
  addComponent
} from "../ViewModel/MetaComponentModelSlice";
import styled from "styled-components";
import { MetaComponentAddPopup } from "./Fragments/MetaComponentAddPopup";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = props => {
  // const dispatch = useDispatch();
  const components = useSelector(selectComponents);
  const [addPopupVisible, setAddPopupvisible] = React.useState<boolean>(false);

  const onButtonClick = () => {
    setAddPopupvisible(true);
    // dispatch(
    //   addComponent({
    //     name: "comp",
    //     width: 10,
    //     heigth: 10,
    //     color: "red"
    //   })
    // );
  };

  return (
    <div>
      <button onClick={onButtonClick}>Add</button>
      <ComponentContainer>
        {components.map((component: ComponentTo, index: number) => {
          return <MetaComponentFragment key={index} {...component} />;
        })}
      </ComponentContainer>
      {addPopupVisible && <MetaComponentAddPopup />}
    </div>
  );
};

// ---------- Styling ----------
const ComponentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
