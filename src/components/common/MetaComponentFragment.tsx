import React, { FunctionComponent } from "react";
import styled from "styled-components";

interface MetaComponentFragmentProps {
  name: string;
  width: number;
  heigth: number;
  color: string;
}

export const MetaComponentFragment: FunctionComponent<MetaComponentFragmentProps> = props => {
  const { name, width, heigth, color } = props;

  // Styling
  const MetaComponent = styled.div`
    width: ${width}em;
    height: ${heigth}em;
    background-color: ${color};
  `;

  return <MetaComponent>{name}</MetaComponent>;
};
