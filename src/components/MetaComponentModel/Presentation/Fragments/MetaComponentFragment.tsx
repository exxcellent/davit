import React, { FunctionComponent } from "react";
import styled from "styled-components";

export interface MetaComponentFragmentProps {
  name: string;
  id: number;
  x: number;
  y: number;
  editCallBack?: () => void;
}

export const MetaComponentFragment: FunctionComponent<MetaComponentFragmentProps> = (
  props
) => {
  const { name, id, editCallBack, x, y } = props;

  console.info("Name: " + name + ", id: " + id + ", callback: " + editCallBack);

  return (
    <MetaComponent>
      <label>ID: {id}</label>
      <br />
      <label>Name: {name}</label>
      <br />
      <label>X: {x}</label>
      <br />
      <label>Y: {y}</label>
    </MetaComponent>
  );
};

// Styling
const MetaComponent = styled.div`
  padding: 10px;
  width: 10em;
  height: 10em;
  background-color: ${(props) => props.theme.color.primary};
  border-radius: ${(props) => props.theme.borderRadius.popup};
`;
