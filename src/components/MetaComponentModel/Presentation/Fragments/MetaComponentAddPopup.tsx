import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Footer } from "../../../common/styles/Footer";
import { CarvButton } from "../../../common/styles/Button";
import { isNullOrUndefined } from "util";
import ComponentTO from "../../../../dataAccess/ComponentTO";

export interface MetaComponentAddPopupProps {
  component: ComponentTO;
  onCallBack: (name: string, id: number, color: string) => void;
}

export const MetaComponentAddPopup: FunctionComponent<MetaComponentAddPopupProps> = (
  props
) => {
  const { name, id } = props.component;

  // ---- states ----
  const [componentName, setComponentName] = React.useState<string>("");
  const [componentId, setComponentId] = React.useState<number>(0);
  const [componentColor, setComponentColor] = React.useState<string>("");

  // ---- initial ----
  React.useEffect(() => {
    if (!isNullOrUndefined(name) && name !== "") {
      setComponentName(name);
    } else {
      setComponentName("New Component");
    }
    setComponentColor("#ADD6D6");
    if (!isNullOrUndefined(id)) {
      setComponentId(id);
    }
  }, [id, name, props.component]);

  // ---- methods ----
  const onClickOk = () => {
    console.log("clicked 'OK' Button.");
    console.log("Name: " + componentName);
    console.log("ID: " + componentId);
    console.log("Color: " + componentColor);
    // validate data
    if (isNullOrUndefined(componentId) || componentId === undefined) {
      alert(
        "Component id is missing! Can't create a new component without id."
      );
      return;
    }
    props.onCallBack(componentName, componentId, componentColor);
  };

  const onClickCancel = () => {
    console.log("clicked 'Cancel' Button.");
    // set own state to visible false
    props.onCallBack("", 0, "");
  };

  return (
    <Popup>
      <Header>
        <label>{componentName}</label>
      </Header>
      <LabelTextField>
        <label>Name</label>
        <input
          type="text"
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
        />
      </LabelTextField>
      <LabelTextField>
        <label>ID</label>
        <input
          type="number"
          value={componentId}
          onChange={(e) => setComponentId(Number(e.target.value))}
        />
      </LabelTextField>
      <LabelTextField>
        <label>Color</label>
        <input
          type="color"
          value={componentColor}
          onChange={(e) => setComponentColor(e.target.value)}
        />
        <label>Hex: {componentColor}</label>
      </LabelTextField>
      <Footer>
        <CarvButton name="Cancel" onClickCallback={onClickCancel}></CarvButton>
        <CarvButton name="OK" onClickCallback={onClickOk}></CarvButton>
      </Footer>
    </Popup>
  );
};

// Styling
const Popup = styled.div`
  position: absolute;
  padding-left: 10px;
  padding-top: 10px;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  width: 15em;
  height: 20em;
  border-radius: ${(props) => props.theme.borderRadius.popup};
  background-color: ${(props) => props.theme.color.primary};
  font-family: ${(props) => props.theme.fontFamily};
`;

const Header = styled.div`
  border-bottom: 3px solid black;
`;

const LabelTextField = styled.div`
  padding-top: 3px;
`;
